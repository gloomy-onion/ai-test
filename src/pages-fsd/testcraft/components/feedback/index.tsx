'use client';

import type { FeedbackResult } from '@/shared/lib/testcraft/types';
import { Button, ScoreCard } from '@/shared/ui';
import styles from './styles.module.scss';

interface FeedbackProps {
  data: FeedbackResult;
  earnedXP: number;
  onBack: () => void;
}

export const FeedbackPanel = ({ data, earnedXP, onBack }: FeedbackProps) => (
  <div className={styles.feedbackContainer}>
    <div className={styles.feedbackScoreRow}>
      <ScoreCard value={data.score} label="Общий балл" />
      <ScoreCard value={data.coverage} suffix="%" label="Покрытие" />
      <ScoreCard value={data.quality} suffix="%" label="Качество" />
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

    <Button variant="primary" fullWidth onClick={onBack}>
      ← Выбрать следующее задание
    </Button>
  </div>
);
