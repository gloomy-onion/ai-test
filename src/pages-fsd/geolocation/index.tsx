'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

type GeoStatus = 'idle' | 'locating' | 'success' | 'denied' | 'error' | 'timeout' | 'unsupported';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unknown';

interface GeoData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

const toGeoData = (position: GeolocationPosition): GeoData => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy,
  altitude: position.coords.altitude ?? null,
  altitudeAccuracy: position.coords.altitudeAccuracy ?? null,
  heading: position.coords.heading ?? null,
  speed: position.coords.speed ?? null,
  timestamp: position.timestamp,
});

const GEO_ERRORS: Record<number, { status: GeoStatus; message: string }> = {
  1: {
    status: 'denied',
    message: 'Доступ запрещён. Разрешите геолокацию в настройках браузера и повторите.',
  },
  2: {
    status: 'error',
    message: 'Координаты недоступны: нет сигнала GPS или сеть не может определить местоположение.',
  },
  3: {
    status: 'timeout',
    message: 'Таймаут: не удалось получить координаты за отведённое время.',
  },
};

export const GeolocationScreen = () => {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [message, setMessage] = useState('');
  const [data, setData] = useState<GeoData | null>(null);
  const [tracking, setTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    const mapped = GEO_ERRORS[error.code];
    if (mapped) {
      setStatus(mapped.status);
      setMessage(mapped.message);
    } else {
      setStatus('error');
      setMessage(`Неизвестная ошибка (${error.code}): ${error.message}`);
    }
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setData(toGeoData(position));
    setStatus('success');
    setMessage('');
  }, []);

  const requestPosition = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      setMessage('Geolocation API не поддерживается этим браузером.');
      return;
    }

    stopTracking();
    setStatus('locating');
    setMessage('');
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, [handleError, handleSuccess, stopTracking]);

  const startTracking = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      setMessage('Geolocation API не поддерживается этим браузером.');
      return;
    }

    setStatus('locating');
    setMessage('');
    setTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
    });
  }, [handleError, handleSuccess]);

  const toggleTracking = () => {
    if (tracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      setMessage('Geolocation API не поддерживается этим браузером.');
      return;
    }

    if (!navigator.permissions?.query) {
      return;
    }

    let mounted = true;
    let statusResult: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result) => {
        if (!mounted) {
          return;
        }
        statusResult = result;
        setPermission(result.state);
        result.addEventListener('change', () => {
          setPermission(result.state);
          if (result.state === 'denied') {
            setStatus('denied');
            setMessage('Доступ запрещён. Разрешите геолокацию в настройках браузера и повторите.');
          }
        });
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
      if (statusResult) {
        statusResult.onchange = null;
      }
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const statusLabel: Record<GeoStatus, { text: string; className: string }> = {
    idle: { text: 'Ожидание', className: 'badgeIdle' },
    locating: { text: 'Определяем позицию…', className: 'badgeLocating' },
    success: { text: 'Доступ разрешён', className: 'badgeSuccess' },
    denied: { text: 'Доступ запрещён', className: 'badgeDenied' },
    error: { text: 'Ошибка', className: 'badgeError' },
    timeout: { text: 'Таймаут', className: 'badgeError' },
    unsupported: { text: 'Не поддерживается', className: 'badgeError' },
  };

  const badge = statusLabel[status];

  return (
    <div className={styles.wrap} data-theme="dark">
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={`${styles.badge} ${styles[badge.className]}`}>{badge.text}</span>
          {permission !== 'unknown' && <span className={styles.perm}>permissions: {permission}</span>}
        </div>

        {status === 'success' && data && (
          <div className={styles.coords}>
            <div className={styles.coordItem}>
              <span className={styles.coordLabel}>Latitude</span>
              <span className={styles.coordValue}>{data.latitude.toFixed(6)}</span>
            </div>
            <div className={styles.coordItem}>
              <span className={styles.coordLabel}>Longitude</span>
              <span className={styles.coordValue}>{data.longitude.toFixed(6)}</span>
            </div>
            <div className={styles.coordItem}>
              <span className={styles.coordLabel}>Accuracy</span>
              <span className={styles.coordValue}>±{Math.round(data.accuracy)} м</span>
            </div>
          </div>
        )}

        {message && <p className={styles.message}>{message}</p>}

        {status === 'success' && data && (
          <p className={styles.meta}>
            Обновлено: {new Date(data.timestamp).toLocaleTimeString()}
            {data.altitude !== null && ` · Высота: ${data.altitude.toFixed(1)} м`}
            {data.speed !== null && ` · Скорость: ${data.speed.toFixed(1)} м/с`}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={requestPosition}
            disabled={status === 'locating' || status === 'unsupported'}
          >
            {status === 'idle' ? 'Получить координаты' : 'Повторить'}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonGhost} ${tracking ? styles.buttonActive : ''}`}
            onClick={toggleTracking}
            disabled={status === 'unsupported' || status === 'denied'}
          >
            {tracking ? '⏹ Остановить отслеживание' : '▶ Отслеживать позицию'}
          </button>
        </div>
      </div>
    </div>
  );
};
