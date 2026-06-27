'use client';

import { TASKS } from '@/shared/lib/testcraft/tasks-data';
import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import { getTotalXP, getLevelInfo } from '@/shared/lib/testcraft/xp-system';
import styles from '../../styles.module.scss';
import { TaskCard } from '../task-card';

interface DashboardScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
}

function buildMiniChart(entries: HistoryEntry[]): string {
  const W = 160;
  const H = 68;
  const P = 8;
  const scores = entries.map((e) => e.score);
  const n = scores.length;
  const mn = Math.max(0, Math.min(...scores) - 10);
  const mx = Math.min(100, Math.max(...scores) + 10);
  const range = mx - mn || 1;
  const pts = scores.map((s, i) => {
    const x = P + (i / (n - 1)) * (W - P * 2);
    const y = H - P - ((s - mn) / range) * (H - P * 2 - 10);

    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  });
  const poly = pts.map((p) => p.join(',')).join(' ');
  const area = `${pts[0][0]},${H - P} ${poly} ${pts[n - 1][0]},${H - P}`;
  const [lx, ly] = pts[n - 1];
  const col = scores[n - 1] >= 80 ? '#4ecd7a' : scores[n - 1] >= 55 ? '#f7b32b' : '#ff5c5c';

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="cg${n}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${col}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${area}" fill="url(#cg${n})"/>
    <polyline points="${poly}" stroke="${col}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="3.5" fill="${col}"/>
    <text x="${Math.min(lx + 5, W - 20)}" y="${Math.max(ly - 5, 10)}" font-size="9" fill="${col}" font-family="monospace" font-weight="600">${scores[n - 1]}</text>
    <text x="${P}" y="${H - 1}" font-size="9" fill="#555a70" font-family="monospace">последние ${n}</text>
  </svg>`;
}

export function DashboardScreen({ history, onOpenTask }: DashboardScreenProps) {
  const xp = getTotalXP(history);
  const lvl = getLevelInfo(xp);
  const done = history.length;
  const avg = done > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / done) : null;

  const featured = TASKS.slice(0, 4);
  const last7 = history.slice(0, 7).reverse();
  const chartSVG = last7.length >= 2 ? buildMiniChart(last7) : '';

  const tasksWord = done === 1 ? 'задание' : done < 5 ? 'задания' : 'заданий';

  return (
    <>
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent)' }}>
            {done}
          </div>
          <div className={styles.statLabel}>Заданий выполнено</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent2)' }}>
            {avg ? `${avg}%` : '—'}
          </div>
          <div className={styles.statLabel}>Средний балл</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent3)' }}>
            10
          </div>
          <div className={styles.statLabel}>Доступно заданий</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--success)' }}>
            {lvl.level}
          </div>
          <div className={styles.statLabel}>Уровень</div>
        </div>
      </div>

      <div className={styles.dashProgress}>
        <div className={styles.dashProgressInner}>
          <div className={styles.dashProgressInfo}>
            <div className={styles.dashProgressTitle}>
              Уровень {lvl.level} — {lvl.title}
            </div>
            <div className={styles.dashProgressSub}>
              {xp} XP
              {lvl.next
                ? ` / ${lvl.next.xpNeeded} до «${lvl.next.title}»`
                : ' — максимальный уровень!'}
            </div>
            <div className={styles.dashProgressBarRow}>
              <span>Прогресс уровня</span>
              <span>{lvl.pct}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${lvl.pct}%` }} />
            </div>
            <div className={styles.dashBadges}>
              <span className={styles.streakBadge}>
                🔥 {done} {tasksWord}
              </span>
              {avg ? (
                <span
                  className={styles.streakBadge}
                  style={{
                    background: 'rgba(108,99,255,0.1)',
                    borderColor: 'rgba(108,99,255,0.3)',
                    color: 'var(--accent)',
                  }}
                >
                  📊 Среднее {avg}%
                </span>
              ) : null}
            </div>
          </div>
          {chartSVG ? (
            <div className={styles.dashChart} dangerouslySetInnerHTML={{ __html: chartSVG }} />
          ) : (
            <div className={styles.dashChartPlaceholder}>
              График появится
              <br />
              после 2+ попыток
            </div>
          )}
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>С чего начать?</div>
        <div className={styles.sectionDesc}>
          Выберите задание и попробуйте написать тест-кейс или баг-репорт. AI-наставник проверит
          вашу работу.
        </div>
      </div>

      <div className={styles.tasksGrid}>
        {featured.map((task) => (
          <TaskCard key={task.id} task={task} history={history} onOpen={onOpenTask} />
        ))}
      </div>
    </>
  );
}
