'use client';

import { useState } from 'react';
import { askTheoryQuestion } from '@/shared/lib/testcraft/ai-provider';
import { THEORY_TOPICS } from '@/shared/lib/testcraft/tasks-data';
import { Button, ChatBubble } from '@/shared/ui';
import styles from './styles.module.scss';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const TheoryScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Привет! Я ваш AI-наставник по QA. Спросите меня о любом виде тестирования, технике, формате документации или лучших практиках.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (q?: string) => {
    const question = (q || input).trim();
    if (!question || loading) {
      return;
    }

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);
    setLoading(true);

    try {
      const response = await askTheoryQuestion(question);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', text: response };

        return copy;
      });
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: 'assistant',
          text: 'Ошибка соединения. Попробуйте ещё раз.',
        };

        return copy;
      });
    }

    setLoading(false);
  };

  return (
    <div className={styles.theoryContainer}>
      <div className={styles.theoryHeader}>
        <span className={styles.sectionTitleLarge}>База знаний QA</span>
        <span className={styles.theorySubtitle}>
          Изучите теорию и спросите AI-наставника о любом аспекте тестирования
        </span>
      </div>

      <div className={styles.theoryGrid}>
        {THEORY_TOPICS.map((t) => (
          <div key={t.title} className={styles.theoryCard} onClick={() => handleAsk(t.q)}>
            <div className={styles.theoryCardIcon}>{t.icon}</div>
            <div className={styles.theoryCardTitle}>{t.title}</div>
            <div className={styles.theoryCardDesc}>{t.desc}</div>
          </div>
        ))}
      </div>

      <div className={styles.theoryChatBox}>
        <div className={styles.theoryChatHeader}>
          <span
            style={{
              width: 8,
              height: 8,
              background: 'var(--accent2)',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 600 }}>
            AI-консультант
          </span>
          <span className={styles.theoryChatHint}>Задайте любой вопрос по QA</span>
        </div>
        <div className={styles.theoryChatMessages}>
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} text={msg.text} streaming />
          ))}
        </div>
        <div className={styles.theoryChatInputRow}>
          <input
            className={styles.theoryInput}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAsk();
              }
            }}
            placeholder="Например: чем тест-кейс отличается от чек-листа?"
          />
          <Button variant="primary" size="sm" onClick={() => handleAsk()} disabled={loading}>
            Спросить
          </Button>
        </div>
      </div>
    </div>
  );
};
