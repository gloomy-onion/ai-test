'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  callClaude,
  buildPrompt,
  getHint,
  getIdealAnswer,
  getProvider,
  getApiKey,
} from '@/shared/lib/helpers/ai-provider';
import { historyApi, draftApi, draftOptions, historyOptions, HISTORY_QUERY_KEY } from '@/shared/api';
import { getAttemptCount, getBestScore } from '@/shared/lib/helpers/history-utils';
import { TASKS, HINTS_MAP } from '@/shared/lib/helpers/tasks-data';
import { calculateRetryXP } from '@/shared/lib/helpers/xp-system';
import { writeClipboard, readClipboard } from '@/shared/lib/helpers/clipboard';
import type { HistoryEntry, FeedbackResult } from '@/shared/lib/helpers/types';
import '@/shared/ui/atoms/button';
import '@/shared/ui/atoms/markdown';
import { FeedbackPanel } from '../../feedback';
import styles from './styles.module.scss';

export const WorkspaceScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const taskId = Number(router.query.id);
  const task = TASKS.find((t) => t.id === taskId);
  const { data: history = [] } = useQuery(historyOptions());
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hintText, setHintText] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [idealAnswer, setIdealAnswer] = useState('');
  const [idealAnswerError, setIdealAnswerError] = useState('');
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);
  const [idealAnswerLoading, setIdealAnswerLoading] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [selfScore, setSelfScore] = useState<number>(0);
  const [showSelfAssess, setShowSelfAssess] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [preview, setPreview] = useState(false);
  const loadedRef = useRef<number | null>(null);

  const attempt = getAttemptCount(history, taskId);
  const prevBest = getBestScore(history, taskId);
  const isRetry = attempt > 1;

  const { data: draftBody, isPending: isDraftPending } = useQuery(draftOptions(taskId));
  const { mutateAsync: saveDraft } = useMutation({
    mutationFn: ({ taskId: tid, body }: { taskId: number; body: string }) => draftApi.save(tid, body),
  });

  const answerRef = useRef(answer);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);

  useEffect(() => {
    answerRef.current = answer;
    dirtyRef.current = true;
  }, [answer]);

  const flushSave = useCallback(
    async (opts?: { force?: boolean }) => {
      const id = task?.id;
      if (!id) return false;
      if (!opts?.force && !dirtyRef.current) return false;
      if (savingRef.current) return false;

      savingRef.current = true;
      dirtyRef.current = false;
      const body = answerRef.current;

      try {
        await saveDraft({ taskId: id, body });
        return true;
      } catch {
        dirtyRef.current = true;
        return false;
      } finally {
        savingRef.current = false;
      }
    },
    [task, saveDraft],
  );

  useEffect(() => {
    if (!task || isDraftPending) {
      return;
    }

    if (loadedRef.current === task.id) {
      return;
    }

    loadedRef.current = task.id;
    setAnswer(draftBody ?? task.template);
    setFeedback(null);
    setError('');
    setHintText('');
    setIdealAnswer('');
    setIdealAnswerError('');
    setShowIdealAnswer(false);
    setSelfScore(0);
    setShowSelfAssess(false);
    setHasResult(false);

    if (draftBody !== null && draftBody !== undefined && draftBody !== task.template) {
      showToast('Загружен сохранённый черновик');
    }
  }, [task, draftBody, isDraftPending]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!task) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => void flushSave(), 10000);
    };
    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
        void flushSave();
      } else {
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
      void flushSave();
    };
  }, [task, flushSave]);

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
      router.push('/settings');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await callClaude(buildPrompt(task, answer));
      setFeedback(result);
      setHasResult(true);

      const earned = calculateRetryXP(task.xp, result.score, prevBest?.score, attempt);
      setEarnedXP(earned);

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
        attempt,
        selfScore: selfScore > 0 ? selfScore : undefined,
        prevBestScore: prevBest?.score,
      };

      queryClient.setQueryData<HistoryEntry[]>([HISTORY_QUERY_KEY], (prev) => [
        entry,
        ...(prev ?? []),
      ]);
      await historyApi.add(entry);
      void queryClient.invalidateQueries({ queryKey: [HISTORY_QUERY_KEY] });

      if (prevBest && result.score > prevBest.score) {
        showToast(`Улучшение! +${earned} XP 🎉`, 'var(--accent3)');
      } else if (!prevBest) {
        showToast(`+${earned} XP заработано! 🎉`, 'var(--accent3)');
      } else {
        showToast('Результат не улучшен. Попробуйте ещё! 💪', 'var(--accent2)');
      }
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Не удалось получить ответ от AI.');
    }
    setLoading(false);
  }, [task, answer, prevBest, attempt, selfScore, router, queryClient]);

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

  const handleIdealAnswer = useCallback(async () => {
    if (!task || idealAnswerLoading) {
      return;
    }
    if (idealAnswer) {
      setShowIdealAnswer(true);
      return;
    }
    setIdealAnswerLoading(true);
    setIdealAnswerError('');
    try {
      const text = await getIdealAnswer(task);
      setIdealAnswer(text);
      setShowIdealAnswer(true);
    } catch {
      setIdealAnswerError('Не удалось получить эталонный ответ.');
      setShowIdealAnswer(true);
    }
    setIdealAnswerLoading(false);
  }, [task, idealAnswer, idealAnswerLoading]);

  const handleCopy = () => {
    writeClipboard(idealAnswer).then(
      () => showToast('Скопировано ✓', 'var(--success)'),
      () => showToast('Не удалось скопировать. Скопируйте вручную.', 'var(--danger)'),
    );
  };

  const handlePaste = () => {
    readClipboard().then(
      (text) => {
        setAnswer(text);
        showToast('Вставлено из буфера обмена ✓', 'var(--success)');
      },
      () => showToast('Буфер обмена пуст. Вставьте вручную.', 'var(--danger)'),
    );
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !loading) {
        e.preventDefault();
        handleSubmit();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (task) {
          flushSave({ force: true }).then((saved) => {
            if (saved) showToast('Черновик сохранён ✓');
          });
        }
      }
    };
    document.addEventListener('keydown', handler);

    return () => document.removeEventListener('keydown', handler);
  }, [task, loading, handleSubmit, flushSave]);

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
          {isRetry && prevBest && (
            <div className={styles.requirementBlock}>
              <div className={styles.reqLabel}>Прошлая попытка</div>
              <div className={styles.requirementValue}>
                Попытка #{attempt - 1} · {prevBest.score}% · {prevBest.date}
              </div>
            </div>
          )}
          <div className={styles.requirementBlock}>
            <div className={styles.reqLabel}>Требования</div>
            <markdown-renderer
              class={styles.requirementText}
              text={task.requirement}
            ></markdown-renderer>
          </div>
          <div className={styles.hintsWrap}>
            <div className={`${styles.reqLabel} ${styles.hintsLabel}`}>Быстрые шаблоны</div>
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
            {chars} симв. · {lines} стр. · попытка #{isRetry ? attempt : 1}
          </span>
          <button-element onClick={() => handlePaste()}>Вставить из буфера</button-element>
        </div>
        <div className={styles.wsPanelBodyColumn}>
          {preview ? (
            <div className={styles.previewArea}>
              <markdown-renderer
                class={styles.previewMarkdown}
                text={answer || '*Начните писать ответ...*'}
              ></markdown-renderer>
            </div>
          ) : (
            <textarea
              id="answerArea"
              className={styles.taskTextarea}
              rows={16}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={task.placeholder}
            />
          )}

          {!hasResult && !showSelfAssess && (
            <div className={styles.selfAssessPrompt}>
              <span className={styles.selfAssessLabel}>
                Оцените свою уверенность (опционально):
              </span>
              <div className={styles.selfAssessStars}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`${styles.selfAssessStar} ${selfScore >= n ? styles.selfAssessStarActive : ''}`}
                    onClick={() => {
                      setSelfScore(selfScore === n ? 0 : n);
                    }}
                  >
                    ★
                  </span>
                ))}
                <span className={styles.selfAssessHint}>
                  {selfScore > 0 ? `${selfScore}/5` : 'не указана'}
                </span>
              </div>
            </div>
          )}

          <div className={styles.wsActions}>
            <button-element size="sm" onClick={() => setPreview((p) => !p)}>
              {preview ? '✏️ Редактировать' : '👁️ Предпросмотр'}
            </button-element>
            <button-element size="sm" onClick={handleGetHint} disabled={hintLoading}>
              💡 {hintLoading ? 'Загрузка...' : 'Подсказка'}
            </button-element>
            <button-element size="sm" onClick={handleIdealAnswer} disabled={idealAnswerLoading}>
              ★ {idealAnswerLoading ? 'Загрузка...' : 'Эталон'}
            </button-element>
            <button-element
              variant="primary"
              size="sm"
              id="submitBtn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Анализирую...' : '✦ Проверить AI'}
            </button-element>
          </div>

          {hintText && (
            <div className={styles.hintPanel}>
              <div className={styles.hintPanelHeader}>
                <span>💡 Подсказка AI</span>
                <button-element variant="primary" size="sm" onClick={() => setHintText('')}>
                  ✕
                </button-element>
              </div>
              <div className={styles.hintPanelBody}>{hintText}</div>
            </div>
          )}

          {showIdealAnswer && (idealAnswer || idealAnswerError) && (
            <div className={styles.idealAnswerPanel}>
              <div className={styles.idealAnswerHeader}>
                <span>★ Эталонный ответ</span>
                <div className={styles.buttons}>
                  <button-element variant="primary" size="sm" onClick={() => handleCopy()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect
                        x="9"
                        y="9"
                        width="10"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                      <path
                        d="M15 9V6C15 4.89543 14.1046 4 13 4H6C4.89543 4 4 4.89543 4 6V13C4 14.1046 4.89543 15 6 15H9"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </svg>
                  </button-element>
                  <button-element
                    variant="primary"
                    size="sm"
                    onClick={() => setShowIdealAnswer(false)}
                  >
                    ✕
                  </button-element>
                </div>
              </div>
              {idealAnswerError ? (
                <div className={styles.feedbackText} style={{ color: 'var(--danger)' }}>
                  {idealAnswerError}
                </div>
              ) : (
                <markdown-renderer
                  class={styles.idealAnswerBody}
                  text={idealAnswer}
                ></markdown-renderer>
              )}
            </div>
          )}

          <div id="feedbackArea">
            {loading && (
              <div className={styles.loadingState}>
                <spinner-element />
                <div>AI-наставник анализирует вашу работу...</div>
              </div>
            )}
            {error && (
              <div className={`${styles.feedbackSection} ${styles.feedbackSectionError}`}>
                <div
                  className={`${styles.feedbackSectionTitle} ${styles.feedbackSectionTitleError}`}
                >
                  Ошибка
                </div>
                <div className={styles.feedbackText}>{error}</div>
              </div>
            )}
            {feedback && (
              <FeedbackPanel
                data={feedback}
                earnedXP={earnedXP}
                selfScore={selfScore > 0 ? selfScore : undefined}
                prevBestScore={prevBest?.score}
                onBack={() => router.push('/tasks')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const showToast = (msg: string, color?: string) => {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  if (color) {
    t.style.borderColor = color;
  }
  document.body.append(t);
  setTimeout(() => t.remove(), 3200);
};