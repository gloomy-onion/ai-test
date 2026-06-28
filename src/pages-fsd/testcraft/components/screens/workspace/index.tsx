'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  callClaude,
  buildPrompt,
  getHint,
  getProvider,
  getApiKey,
} from '@/shared/lib/testcraft/ai-provider';
import { loadDraft, saveDraft, hasDraft } from '@/shared/lib/testcraft/storage';
import { TASKS, HINTS_MAP } from '@/shared/lib/testcraft/tasks-data';
import type { HistoryEntry, FeedbackResult } from '@/shared/lib/testcraft/types';
import { Button, Spinner } from '@/shared/ui';
import { FeedbackPanel } from '../../feedback';
import styles from './styles.module.scss';

interface WorkspaceScreenProps {
  taskId: number;
  history: HistoryEntry[];
  onBack: () => void;
  onSaveResult: (entry: HistoryEntry) => void;
  onUpdateSidebar: () => void;
}

export const WorkspaceScreen = ({
  taskId,
  history,
  onBack,
  onSaveResult,
  onUpdateSidebar,
}: WorkspaceScreenProps) => {
  const task = TASKS.find((t) => t.id === taskId);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hintText, setHintText] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  useEffect(() => {
    if (!task) {
      return;
    }
    const initial = loadDraft(task.id, task.template);
    setAnswer(initial);
    setFeedback(null);
    setError('');
    setHintText('');
    if (hasDraft(task.id, task.template)) {
      showToast('Загружен сохранённый черновик');
    }
  }, [task]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(() => {
      if (task) {
        saveDraft(task.id, answer);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [task, answer]);

  const chars = answer.length;
  const lines = answer.split('\n').length;

  const handleSubmit = useCallback(async () => {
    if (!task) {
      return;
    }
    if (answer.trim().length < 20) {
      showToast('Напишите что-нибудь перед проверкой 😊');

      return;
    }
    const prov = getProvider();
    if (prov !== 'claude' && !getApiKey()) {
      showToast('Добавьте API-ключ в Настройках API ⚙', 'var(--danger)');
      onBack();

      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await callClaude(buildPrompt(task, answer));
      setFeedback(result);
      const earned = Math.round((task.xp * result.score) / 100);
      setEarnedXP(earned);
      const prev = history.find((h) => h.taskId === task.id);
      const entry: HistoryEntry = {
        taskId: task.id,
        taskTitle: task.title,
        score: result.score,
        xp: earned,
        date: new Date().toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      onSaveResult(entry);
      onUpdateSidebar();
      if (!prev || prev.score < result.score) {
        showToast(`+${earned} XP заработано! 🎉`, 'var(--accent3)');
      }
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Не удалось получить ответ от AI.');
    }
    setLoading(false);
  }, [task, answer, history, onBack, onSaveResult, onUpdateSidebar]);

  const handleGetHint = useCallback(async () => {
    if (!task) {
      return;
    }
    setHintLoading(true);
    try {
      const text = await getHint(task, answer);
      setHintText(text);
    } catch {
      setHintText('Не удалось получить подсказку.');
    }
    setHintLoading(false);
  }, [task, answer]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !loading) {
        e.preventDefault();
        handleSubmit();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (task) {
          saveDraft(task.id, answer);
          showToast('Черновик сохранён ✓');
        }
      }
    };
    document.addEventListener('keydown', handler);

    return () => document.removeEventListener('keydown', handler);
  }, [task, answer, loading, handleSubmit]);

  if (!task) {
    return <div className={styles.emptyState}>Задание не найдено</div>;
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.wsPanel}>
        <div className={styles.wsPanelHeader}>
          <span className={`${styles.wsPanelDot} ${styles.wsPanelDotAccent2}`} />
          <span className={styles.wsPanelTitle}>Требования и задание</span>
        </div>
        <div className={styles.wsPanelBody}>
          <div className={styles.requirementBlock}>
            <div className={styles.reqLabel}>Тип документа</div>
            <div className={styles.requirementValue}>{task.docLabel}</div>
          </div>
          <div className={styles.requirementBlock}>
            <div className={styles.reqLabel}>Задание</div>
            <div className={styles.requirementText}>{task.desc}</div>
          </div>
          <div className={styles.requirementBlock}>
            <div className={styles.reqLabel}>Требования</div>
            <div className={styles.requirementText}>{task.requirement}</div>
          </div>
          <div className={styles.hintsWrap}>
            <div className={`${styles.reqLabel} ${styles.hintsLabel}`}>
              Быстрые шаблоны
            </div>
            <div className={styles.templateHints}>
              {HINTS_MAP[task.type]?.map((h) => (
                <span
                  key={h}
                  className={styles.templateChip}
                  onClick={() => {
                    const ta = document.getElementById('answerArea') as HTMLTextAreaElement | null;
                    if (ta) {
                      const pos = ta.selectionStart;
                      const val = ta.value;
                      const newVal = val.slice(0, pos) + h + val.slice(pos);
                      setAnswer(newVal);
                      setTimeout(() => {
                        ta.focus();
                        ta.selectionStart = ta.selectionEnd = pos + h.length;
                      }, 0);
                    }
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wsPanel}>
        <div className={styles.wsPanelHeader}>
          <span className={`${styles.wsPanelDot} ${styles.wsPanelDotAccent}`} />
          <span className={styles.wsPanelTitle}>Ваш ответ</span>
          <span className={styles.charCount}>
            {chars} симв. · {lines} стр.
          </span>
        </div>
        <div className={styles.wsPanelBodyColumn}>
          <textarea
            id="answerArea"
            className={styles.taskTextarea}
            rows={20}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={task.placeholder}
          />
          <div className={styles.wsActions}>
            <Button size="sm" onClick={handleGetHint} disabled={hintLoading}>
              💡 {hintLoading ? 'Загрузка...' : 'Подсказка'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              id="submitBtn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Анализирую...' : '✦ Проверить AI'}
            </Button>
          </div>

          {hintText && (
            <div className={styles.hintPanel}>
              <div className={styles.hintPanelHeader}>
                <span>💡 Подсказка AI</span>
                <span className={styles.closeHint} onClick={() => setHintText('')}>
                  ✕
                </span>
              </div>
              <div className={styles.hintPanelBody}>{hintText}</div>
            </div>
          )}

          <div id="feedbackArea">
            {loading && (
              <div className={styles.loadingState}>
                <Spinner />
                <div>AI-наставник анализирует вашу работу...</div>
              </div>
            )}
            {error && (
              <div className={`${styles.feedbackSection} ${styles.feedbackSectionError}`}>
                <div className={`${styles.feedbackSectionTitle} ${styles.feedbackSectionTitleError}`}>
                  Ошибка
                </div>
                <div className={styles.feedbackText}>{error}</div>
              </div>
            )}
            {feedback && <FeedbackPanel data={feedback} earnedXP={earnedXP} onBack={onBack} />}
          </div>
        </div>
      </div>
    </div>
  );
};

function showToast(msg: string, color?: string) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  if (color) {
    t.style.borderColor = color;
  }
  document.body.append(t);
  setTimeout(() => t.remove(), 3200);
}
