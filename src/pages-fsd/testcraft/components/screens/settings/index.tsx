'use client';

import { useState, useEffect } from 'react';
import {
  PROVIDERS,
  getProvider,
  setProvider,
  getApiKey,
  setApiKey,
  removeApiKey,
  testApiConnection,
} from '@/shared/lib/testcraft/ai-provider';
import { Button } from '@/shared/ui';
import styles from './styles.module.scss';

export const SettingsScreen = () => {
  const [selected, setSelected] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [status, setStatus] = useState<{ type: string; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const prov = getProvider();
    setSelected(prov);
    setKeyInput(getApiKey(prov));
    setStatus(null);
  }, []);

  const handleSelect = (id: string) => {
    setSelected(id);
    setProvider(id);
    setKeyInput(getApiKey(id));
    setStatus(null);
  };

  const handleSave = () => {
    if (keyInput) {
      setApiKey(selected, keyInput);
    } else {
      removeApiKey(selected);
    }
    setStatus({ type: 'success', text: 'Ключ сохранён ✓' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleClear = () => {
    removeApiKey(selected);
    setKeyInput('');
    setStatus({ type: 'info', text: 'Ключ удалён' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setStatus({ type: 'testing', text: '⟳ Отправляю тестовый запрос...' });
    const result = await testApiConnection(selected, keyInput || getApiKey(selected));
    setStatus({ type: result.ok ? 'success' : 'error', text: result.message });
    setTesting(false);
  };

  const prov = PROVIDERS[selected];
  const isClaude = selected === 'claude';
  const isFree = prov?.free && !isClaude;

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsTitle}>Настройки API</div>
      <div className={styles.settingsDesc}>
        Выберите AI-провайдера для проверки заданий. Ключ хранится только в вашем браузере.
      </div>

      <div className={styles.settingsCard}>
        <div className={styles.settingsCardTitle}>Провайдер</div>
        <div className={styles.settingsCardDesc}>
          Claude работает автоматически внутри claude.ai без ключа. Для остальных или для локального
          запуска нужен API-ключ.
        </div>
        <div className={styles.providerGrid}>
          {Object.entries(PROVIDERS).map(([id, p]) => (
            <div
              key={id}
              className={`${styles.providerCard} ${selected === id ? styles.providerCardSelected : ''}`}
              onClick={() => handleSelect(id)}
            >
              <div className={styles.providerName}>{p.name}</div>
              <div className={styles.providerNote}>
                {p.free ? (
                  <span className={styles.freeText}>Бесплатно</span>
                ) : p.name === 'Claude' ? (
                  'Anthropic'
                ) : (
                  'OpenAI'
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {prov && (
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardTitle}>API-ключ для {prov.name}</div>
          <div className={styles.settingsCardDesc}>
            {isClaude
              ? 'Внутри claude.ai ключ не нужен — авторизация автоматическая. Для локального запуска вставьте ключ ниже.'
              : isFree
                ? 'Бесплатный провайдер! Зарегистрируйтесь, получите ключ и вставьте ниже. Карта не нужна.'
                : 'Вставьте ключ ниже. Он хранится только в вашем браузере и нигде не передаётся.'}
          </div>
          <input
            className={styles.settingsInput}
            type="password"
            value={keyInput}
            onChange={(e) => {
              setKeyInput(e.target.value);
              setStatus(null);
            }}
            placeholder={prov.keyHint}
          />
          <div className={styles.settingsActions}>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Сохранить ключ
            </Button>
            <Button size="sm" onClick={handleTest} disabled={testing}>
              {testing ? 'Проверяю...' : 'Проверить соединение'}
            </Button>
            <Button size="sm" onClick={handleClear}>
              Удалить ключ
            </Button>
          </div>
          {status && (
            <div
              className={`${styles.apiStatus} ${styles[`apiStatus${status.type === 'success' ? 'Ok' : status.type === 'error' ? 'Error' : 'Testing'}`]}`}
            >
              {status.text}
            </div>
          )}
        </div>
      )}

      <div className={`${styles.settingsCard} ${styles.settingsCardGreen}`}>
        <div className={`${styles.settingsCardTitle} ${styles.settingsCardTitleGreen}`}>
          Где взять ключ?
        </div>
        <div className={styles.keyLinks}>
          <div>
            ✧ <b>Gemini</b> — <span className={styles.keyLink}>aistudio.google.com</span>{' '}
            <span className={styles.freeTag}>● бесплатно, без карты</span>
          </div>
          <div>
            ⚡ <b>Groq</b> — <span className={styles.keyLink}>console.groq.com</span>{' '}
            <span className={styles.freeTag}>● бесплатно, без карты</span>
          </div>
          <div>
            🐋 <b>DeepSeek</b> — <span className={styles.keyLink}>platform.deepseek.com</span>{' '}
            <span className={styles.paidTag}>● $5 при регистрации</span>
          </div>
          <div>
            ⚙ <b>Claude</b> — <span className={styles.keyLink}>console.anthropic.com</span>
          </div>
          <div>
            ✦ <b>ChatGPT</b> — <span className={styles.keyLink}>platform.openai.com/api-keys</span>
          </div>
        </div>
      </div>

      <div className={styles.settingsCard}>
        <div className={styles.settingsCardTitle}>Текущее состояние</div>
        <div className={styles.statusText}>
          Провайдер: <b>{prov?.name}</b>
          {prov?.free ? <span className={styles.statusTextSuccess}>● бесплатно</span> : ''}
          {' · '}
          Ключ:{' '}
          {keyInput ? (
            <span className={styles.statusTextSuccess}>
              ✓ Ключ сохранён ({keyInput.slice(0, 8)}...)
            </span>
          ) : isClaude ? (
            <span className={styles.statusTextAuto}>✓ Авто-авторизация (claude.ai)</span>
          ) : (
            <span className={styles.statusTextMissing}>✗ Ключ не добавлен</span>
          )}
        </div>
      </div>
    </div>
  );
};
