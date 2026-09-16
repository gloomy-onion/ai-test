'use client';

import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { createBrowserSupabase } from '@/shared/lib/supabase';
import styles from './styles.module.scss';

type OAuthProvider = 'google' | 'github';

const OAuthIcon = ({ provider }: { provider: OAuthProvider }) => {
  if (provider === 'google') {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
        />
      </svg>
    );
  }

  if (provider === 'github') {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.005-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"
        />
      </svg>
    );
  }
};

export const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserSupabase();

  const next = router.query.next;
  const safeNext = (() => {
    const n = Array.isArray(next) ? next[0] : next;
    return typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') ? n : '/';
  })();

  const signInWithOAuth = async (provider: OAuthProvider) => {
    setError('');
    setNotice('');
    setIsLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Fill in all fields');
      return;
    }

    const trimmedUsername = username.trim();
    if (mode === 'signup' && (!trimmedUsername || trimmedUsername.length < 2 || trimmedUsername.length > 30)) {
      setError('Username must be 2-30 characters');
      return;
    }

    setError('');
    setNotice('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: trimmedUsername },
            emailRedirectTo: `${window.location.origin}${safeNext}`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (!data.session) {
          setNotice('Registration successful! Check your email to confirm your account.');
        } else {
          router.push(safeNext);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          router.push(safeNext);
        }
      }
    } catch (error_) {
      setError('Network error. Please try again.');
      console.error('Auth error:', error_);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError('');
    setNotice('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{mode === 'login' ? 'Login' : 'Sign up'}</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Иван Петров"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <span className={styles.error}>{error}</span>}
          {notice && <span className={styles.notice}>{notice}</span>}

          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>или</span>
        </div>

        <div className={styles.oauth}>
          <button
            className={`${styles.oauthBtn} ${styles.oauthGoogle}`}
            type="button"
            onClick={() => signInWithOAuth('google')}
            disabled={isLoading}
          >
            <OAuthIcon provider="google" />
            <span>Войти через Google</span>
          </button>
          <button
            className={`${styles.oauthBtn} ${styles.oauthGithub}`}
            type="button"
            onClick={() => signInWithOAuth('github')}
            disabled={isLoading}
          >
            <OAuthIcon provider="github" />
            <span>Войти через GitHub</span>
          </button>
          {/*<button*/}
          {/*  className={`${styles.oauthBtn} ${styles.oauthVk}`}*/}
          {/*  type="button"*/}
          {/*  onClick={() => signInWithOAuth('custom:vk')}*/}
          {/*  disabled={isLoading}*/}
          {/*>*/}
          {/*  <OAuthIcon provider="custom:vk" />*/}
          {/*  <span>Войти через VK</span>*/}
          {/*</button>*/}
        </div>

        <button className={styles.switchBtn} type="button" onClick={switchMode} disabled={isLoading}>
          {mode === 'login' ? 'No account? Sign up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};
