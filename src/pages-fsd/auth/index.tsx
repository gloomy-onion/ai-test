'use client';

import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { createBrowserSupabase } from '@/shared/lib/supabase';
import styles from './styles.module.scss';

export const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserSupabase();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Fill in all fields');
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
          options: { emailRedirectTo: window.location.origin },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (!data.session) {
          setNotice('Registration successful! Check your email to confirm your account.');
        } else {
          router.push('/');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          router.push('/');
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

        <button className={styles.switchBtn} type="button" onClick={switchMode} disabled={isLoading}>
          {mode === 'login' ? 'No account? Sign up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};