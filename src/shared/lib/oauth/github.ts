/**
 * GitHub OAuth 2.0 Authorization Code Flow with PKCE — реализация вручную,
 * без SDK и готовых решений.
 *
 * Роли OAuth в этом модуле:
 *  - Resource Owner        — пользователь GitHub
 *  - User Agent            — браузер
 *  - Client                — наше приложение (Next.js)
 *  - Authorization Server  — https://github.com/login/oauth/*
 *  - Resource Server       — https://api.github.com/*
 */

const AUTHORIZATION_ENDPOINT = 'https://github.com/login/oauth/authorize';
const TOKEN_ENDPOINT = 'https://github.com/login/oauth/access_token';
const RESOURCE_SERVER_USER = 'https://api.github.com/user';

export const GITHUB_SCOPE = 'read:user user:email';

/** P256 code_verifier: 64 случайных байта, base64url (RFC 7636, допустимо 43..128 символов). */
export function createCodeVerifier(): string {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/** Случайный state для защиты от CSRF (энтропия от CSPRNG, а не от времени). */
export function createState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/** code_challenge = BASE64URL(SHA256(code_verifier)), метод S256 из RFC 7636. */
export async function computeCodeChallenge(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Authorization Request. В браузере уходят только публичные данные:
 * client_id (публичный идентификатор клиента), redirect_uri, scope, state,
 * code_challenge (уже необратимое производное от verifier).
 * code_verifier НИКОГДА не участвует в этом запросе — иначе перехвативший
 * authorization code смог бы вычислить его и обменять код на токен.
 */
export function buildAuthorizationUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}): string {
  const q = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    scope: GITHUB_SCOPE,
    state: params.state,
    // response_type=code — именно Authorization Code Grant, а не token (implicit)
    response_type: 'code',
    code_challenge: params.codeChallenge,
    code_challenge_method: 'S256',
  });
  return `${AUTHORIZATION_ENDPOINT}?${q.toString()}`;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

/**
 * Token Request (back-channel, только server-to-server).
 * Здесь и только здесь участвует client_secret confidential-клиента.
 * code_verifier доказывается сервером GitHub: SHA256(verifier) должен
 * совпасть с code_challenge из Authorization Request, а code должен быть
 * живым, выданным именно под наш redirect_uri и не использованным ранее.
 */
export async function exchangeCodeForToken(params: {
  code: string;
  state: string;
  codeVerifier: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: params.code,
    redirect_uri: params.redirectUri,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    code_verifier: params.codeVerifier,
    state: params.state,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new OAuthError(`token_endpoint_http_${res.status}`);
  }

  const data = (await res.json()) as Partial<TokenResponse> & { error?: string; error_description?: string };

  if (data.error || !data.access_token) {
    // GitHub возвращает { error: 'bad_verification_code' | 'incorrect_pkce_verifier' | ... }
    throw new OAuthError(data.error ?? 'unknown_token_error', data.error_description);
  }

  return {
    access_token: data.access_token,
    token_type: data.token_type ?? 'bearer',
    scope: data.scope ?? '',
  };
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
  html_url: string;
}

/**
 * Запрос к Resource Server с Bearer-токеном.
 * Access Token называется Bearer («носимый») потому, что предъявитель токена
 * и есть авторизованное лицо: кто покажет токен в Authorization-заголовке,
 * от того GitHub и выполнит операцияи в пределах scope. Никакого
 * дополнительного подтверждения личности в запросе нет.
 */
export async function fetchGithubUser(accessToken: string): Promise<GitHubUser> {
  const res = await fetch(RESOURCE_SERVER_USER, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
  });

  if (res.status === 401) {
    throw new OAuthError('resource_server_unauthorized', 'Access Token missing, invalid or expired');
  }
  if (!res.ok) {
    throw new OAuthError(`resource_server_http_${res.status}`);
  }

  const user = (await res.json()) as GitHubUser;
  return user;
}

/** Публичный email пользователя (scoped-запрос, отдельный от /user endpoint). */
export async function fetchGithubEmails(accessToken: string): Promise<string[]> {
  const res = await fetch(`${RESOURCE_SERVER_USER}/emails`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const emails = (await res.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
  return emails.filter((e) => e.verified).map((e) => e.email);
}

export class OAuthError extends Error {
  description?: string;
  constructor(code: string, description?: string) {
    super(code);
    this.name = 'OAuthError';
    this.description = description;
  }
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return Buffer.from(binary, 'binary').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function getServerConfig() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new OAuthError('missing_github_env', 'Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env');
  }
  return { clientId, clientSecret };
}

export function buildRedirectUri(reqHost: string, reqUrl: string): string {
  // redirect_uri в Token Request обязан совпадать с Authorization Request байт в байт,
    // поэтому строим его стабильно из входного запроса.
  const proto = process.env.OAUTH_REDIRECT_PROTO ?? 'http';
  const explicit = process.env.GITHUB_OAUTH_REDIRECT_URI;
  if (explicit) return explicit;
  const host = reqHost.split(',')[0].trim();
  return `${proto}://${host}/api/auth/github/callback`;
}
