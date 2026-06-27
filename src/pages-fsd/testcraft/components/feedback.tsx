'use client';

import { scoreColor } from '@/shared/lib/testcraft/ai-provider';
import type { FeedbackResult } from '@/shared/lib/testcraft/types';
import styles from '../styles.module.scss';

interface FeedbackProps {
  data: FeedbackResult;
  earnedXP: number;
  onBack: () => void;
}

export function FeedbackPanel({ data, earnedXP, onBack }: FeedbackProps) {
  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.feedbackScoreRow}>
        <div className={styles.scoreCard}>
          <div className={`${styles.scoreVal} ${styles[scoreColor(data.score)]}`}>{data.score}</div>
          <div className={styles.scoreLabel}>Общий балл</div>
        </div>
        <div className={styles.scoreCard}>
          <div className={`${styles.scoreVal} ${styles[scoreColor(data.coverage)]}`}>
            {data.coverage}%
          </div>
          <div className={styles.scoreLabel}>Покрытие</div>
        </div>
        <div className={styles.scoreCard}>
          <div className={`${styles.scoreVal} ${styles[scoreColor(data.quality)]}`}>
            {data.quality}%
          </div>
          <div className={styles.scoreLabel}>Качество</div>
        </div>
      </div>

      <div className={styles.scoreCardXP}>
        <div className={styles.xpEarned}>+{earnedXP} XP заработано</div>
      </div>

      <div className={styles.feedbackSection}>
        <div className={styles.feedbackSectionTitle}>Вывод AI-наставника</div>
        <div className={styles.feedbackText}>{data.summary}</div>
      </div>

      {data.good?.length ? (
        <div className={styles.feedbackSection}>
          <div className={styles.feedbackSectionTitle}>Хорошо сделано ✓</div>
          <ul className={`${styles.feedbackList} ${styles.feedbackListGood}`}>
            {data.good.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.missing?.length ? (
        <div className={styles.feedbackSection}>
          <div className={styles.feedbackSectionTitle}>Пропущено или неверно ✗</div>
          <ul className={`${styles.feedbackList} ${styles.feedbackListBad}`}>
            {data.missing.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.tips?.length ? (
        <div className={styles.feedbackSection}>
          <div className={styles.feedbackSectionTitle}>Советы наставника 💡</div>
          <ul className={styles.feedbackList}>
            {data.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        className={`${styles.btn} ${styles.btnPrimary}`}
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={onBack}
      >
        ← Выбрать следующее задание
      </button>
    </div>
  );
}
