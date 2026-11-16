import type { NextApiRequest, NextApiResponse } from 'next';
import {
  buildAuthorizationUrl,
  computeCodeChallenge,
  createCodeVerifier,
  createState,
  getServerConfig,
  OAuthError,
} from '@/shared/lib/oauth/github';
import { buildRedirectUri } from '@/shared/lib/oauth/github';
import { PKCE_COOKIE, PKCE_MAX_AGE, serializeCookie, type PkceBag } from '@/shared/lib/oauth/cookies';

/**
 * Старт flow (front-channel): генерируем code_verifier + state, прячем их в
 * подписанную HttpOnly-cookie и 302-редиректим браузер на Authorization
 * Endpoint провайдера. client_id — публичные данные, его в URL отдаём смело;
 * code_verifier в запрос НЕ уходит (иначе перехват кода = перехват токена).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { clientId } = getServerConfig();
    const redirectUri = buildRedirectUri(req.headers.host ?? 'localhost:3000', req.url ?? '');

    const verifier = createCodeVerifier();
    const challenge = await computeCodeChallenge(verifier);
    const state = createState();

    const nextRaw = req.query.next;
    const next = typeof nextRaw === 'string' && nextRaw.startsWith('/') && !nextRaw.startsWith('//') ? nextRaw : '/settings';

    const bag: PkceBag = { state, verifier, redirectUri, next };
    res.setHeader('Set-Cookie', serializeCookie(PKCE_COOKIE, bag, PKCE_MAX_AGE));

    const url = buildAuthorizationUrl({ clientId, redirectUri, state, codeChallenge: challenge });
    return res.redirect(302, url);
  } catch (e) {
    const code = e instanceof OAuthError ? e.code : 'start_failed';
    return res.redirect(302, `/auth?error=${encodeURIComponent(code)}`);
  }
}
