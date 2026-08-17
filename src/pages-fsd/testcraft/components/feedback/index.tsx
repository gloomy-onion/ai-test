'use client';

import type { FeedbackResult } from '@/shared/lib/helpers/types';
import { ScoreCard } from '@/shared/ui';
import styles from './styles.module.scss';

interface FeedbackProps {
  data: FeedbackResult;
  earnedXP: number;
  selfScore?: number;
  prevBestScore?: number;
  onBack: () => void;
}

const scoreColor = (n: number): string => {
  if (n >= 80) return 'var(--accent3)';
  if (n >= 55) return 'var(--accent2)';
  return 'var(--danger)';
};

export const FeedbackPanel = ({ data, earnedXP, selfScore, prevBestScore, onBack }: FeedbackProps) => {
  const awareness = selfScore && data.score
    ? 100 - Math.abs(selfScore * 20 - data.score)
    : undefined;

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.feedbackScoreRow}>
        <ScoreCard value={data.score} label="Общий балл" />
        <ScoreCard value={data.coverage} suffix="%" label="Покрытие" />
        <ScoreCard value={data.quality} suffix="%" label="Качество" />
      </div>

      <div className={styles.scoreCardXP}>
        <div className={styles.xpEarned}>+{earnedXP} XP заработано</div>
      </div>

      {prevBestScore !== undefined && (
        <div className={styles.improvementBanner}>
          {data.score > prevBestScore ? (
            <span style={{ color: 'var(--accent3)' }}>
              📈 Улучшение с {prevBestScore}% до {data.score}% (+{data.score - prevBestScore}%)
            </span>
          ) : (
            <span style={{ color: 'var(--text2)' }}>
              🔄 Результат: {data.score}% (предыдущий: {prevBestScore}%)
            </span>
          )}
        </div>
      )}

      {selfScore && (
        <div className={styles.selfAwarenessBanner}>
          <span>🧠 Самооценка: {selfScore}/5</span>
          {awareness !== undefined && (
            <span style={{ color: scoreColor(awareness), marginLeft: 12 }}>
              Осознанность: {Math.max(0, awareness)}%
            </span>
          )}
        </div>
      )}

      <div className={styles.feedbackSection}>
        <div className={styles.feedbackSectionTitle}>Вывод AI-наставника</div>
        <div className={styles.feedbackText}>{data.summary}</div>
      </div>

      {data.sections?.length ? (
        <div className={styles.feedbackSection}>
          <div className={styles.feedbackSectionTitle}>Разбор по разделам</div>
          <div className={styles.sectionsGrid}>
            {data.sections.map((s, i) => (
              <div key={i} className={styles.sectionCard}>
                <div className={styles.sectionCardHeader}>
                  <span className={styles.sectionCardTitle}>{s.title}</span>
                  <span
                    className={styles.sectionCardScore}
                    style={{ color: scoreColor(s.score) }}
                  >
                    {s.score}%
                  </span>
                </div>
                <div className={styles.sectionCardComment}>{s.comment}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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

      <button-element variant="primary" full-width onClick={onBack}>
        ← Выбрать следующее задание
      </button-element>
    </div>
  );
};
