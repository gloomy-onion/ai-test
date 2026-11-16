import type { NextApiRequest, NextApiResponse } from 'next';
import {
  buildRedirectUri,
  exchangeCodeForToken,
  fetchGithubUser,
  getServerConfig,
  OAuthError,
} from '@/shared/lib/oauth/github';
import {
  PKCE_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  parseSignedCookie,
  serializeCookie,
  type GhSession,
  type PkceBag,
} from '@/shared/lib/oauth/cookies';

/**
 * Callback (приём Authorization Response).
 * Провайдер вернул браузер сюда с ?code=...&state=...
 * 1. сверяем state с тем, что сами положили в cookie перед стартом (CSRF-защита);
 * 2. меняем code на access_token — back-channel POST на Token Endpoint,
 *    с code_verifier и client_secret, браузер про это никогда не узнает;
 * 3. идём на Resource Server за профилем;
 * 4. заводим свою сессию подключённого аккаунта и редиректим в приложение.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fail = (reason: string) => res.redirect(302, `/auth?error=${encodeURIComponent(reason)}`);

  const raw = req.cookies?.[PKCE_COOKIE];
  let bag: PkceBag | null = null;
  try {
    const json = parseSignedCookie(typeof raw === 'string' ? raw : undefined);
    bag = json ? (JSON.parse(json) as PkceBag) : null;
  } catch {
    bag = null;
  }

  // PKCE-конверт живёт 10 минут; истёк/подделан/отсутствует — пересоздаём flow.
  if (!bag) return fail('state_expired');

  // Очистка одноразового конверта: состояние можно использовать ровно один раз.
  res.setHeader('Set-Cookie', serializeCookie(PKCE_COOKIE, '', 0));

  const err = req.query.error;
  if (typeof err === 'string') {
    // пользователь отверг запрос или провайдер отверг параметры (invalid_request и пр.)
    return fail(`provider_${err}`);
  }

  const code = req.query.code;
  const state = req.query.state;

  if (typeof code !== 'string' || typeof state !== 'string') return fail('missing_code_or_state');
  if (state !== bag.state) return fail('state_mismatch');

  try {
    const { clientId, clientSecret } = getServerConfig();

    const tokens = await exchangeCodeForToken({
      code,
      state,
      codeVerifier: bag.verifier,
      clientId,
      clientSecret,
      redirectUri: bag.redirectUri,
    });

    const gh = await fetchGithubUser(tokens.access_token);

    const session: GhSession = {
      login: gh.login,
      name: gh.name,
      avatar_url: gh.avatar_url,
      email: gh.email,
      html_url: gh.html_url,
      scope: tokens.scope,
      connected_at: new Date().toISOString(),
    };

    res.appendHeader('Set-Cookie', serializeCookie(SESSION_COOKIE, session, SESSION_MAX_AGE));
    return res.redirect(302, bag.next || '/settings');
  } catch (e) {
    const code2 = e instanceof OAuthError ? e.code : 'callback_failed';
    return fail(code2);
  }
}
