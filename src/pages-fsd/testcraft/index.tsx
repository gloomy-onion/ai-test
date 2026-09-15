'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, HydrationBoundary, type DehydratedState } from '@tanstack/react-query';
import { historyApi, historyOptions, settingsOptions, HISTORY_QUERY_KEY } from '@/shared/api';
import { cacheProvider } from '@/shared/lib/helpers/ai-provider';
import { migrateLegacyHistory } from '@/shared/lib/helpers/legacy-history';
import { createBrowserSupabase } from '@/shared/lib/supabase';
import type { HistoryEntry } from '@/shared/lib/helpers/types';
import { Header } from './components/header';
import { DashboardScreen } from './components/screens/dashboard';
import { HistoryScreen } from './components/screens/history';
import { ProfileScreen } from './components/screens/profile';
import { SettingsScreen } from './components/screens/settings';
import { TasksListScreen } from './components/screens/tasks-list';
import { TheoryScreen } from './components/screens/theory';
import { WorkspaceScreen } from './components/screens/workspace';
import { Sidebar } from './components/sidebar';
import styles from './styles.module.scss';

interface TestCraftPageProps {
  authUser: string;
  dehydratedState?: DehydratedState;
}

type ScreenName =
  | 'dashboard'
  | 'tasks'
  | 'history'
  | 'workspace'
  | 'theory'
  | 'profile'
  | 'settings';

const SCREEN_TITLES: Record<string, [string, string]> = {
  dashboard: ['Дашборд', 'Добро пожаловать в TestCraft AI'],
  tasks: ['Задания', 'Выберите задание для практики'],
  history: ['История', 'Ваши выполненные задания'],
  workspace: ['Рабочее пространство', ''],
  theory: ['База знаний', 'Теория и AI-консультант'],
  profile: ['Профиль', 'Ваш прогресс и достижения'],
  settings: ['Настройки API', 'Провайдер и ключ для проверки заданий'],
};

export const TestCraftPage = ({ authUser, dehydratedState }: TestCraftPageProps) => {
  const queryClient = useQueryClient();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [tasksFilter, setTasksFilter] = useState('all');

  const { data: history = [] } = useQuery(historyOptions());
  const { data: provider } = useQuery(settingsOptions());

  useEffect(() => {
    if (provider) {
      cacheProvider(provider);
    }
  }, [provider]);

  useEffect(() => {
    void migrateLegacyHistory().then(() => {
      void queryClient.invalidateQueries({ queryKey: [HISTORY_QUERY_KEY] });
    });
  }, [queryClient]);

  const saveMutation = useMutation({
    mutationFn: (entry: HistoryEntry) => historyApi.add(entry),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [HISTORY_QUERY_KEY] }),
  });

  const clearMutation = useMutation({
    mutationFn: () => historyApi.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [HISTORY_QUERY_KEY] }),
  });

  const handleNavigate = useCallback((name: string) => {
    setCurrentScreen(name as ScreenName);
  }, []);

  const handleOpenTask = useCallback((id: number) => {
    setCurrentTaskId(id);
    setCurrentScreen('workspace');
  }, []);

  const handleSaveResult = useCallback(
    (entry: HistoryEntry) => {
      queryClient.setQueryData<HistoryEntry[]>([HISTORY_QUERY_KEY], (prev) => [entry, ...(prev ?? [])]);
      saveMutation.mutate(entry);
    },
    [queryClient, saveMutation],
  );

  const handleUpdateSidebar = useCallback(() => {}, []);

  const handleClearHistory = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  const handleFilterTasks = useCallback((type: string) => {
    setTasksFilter(type);
    setCurrentScreen('tasks');
  }, []);

  const handleLogout = useCallback(async () => {
    await createBrowserSupabase().auth.signOut();
    window.location.href = '/auth';
  }, []);

  const [title, subtitle] =
    currentScreen === 'workspace' ? ['', ''] : SCREEN_TITLES[currentScreen] || ['', ''];

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={styles.app} data-theme="dark">
        <Sidebar
          currentScreen={currentScreen}
          history={history}
          authUser={authUser}
          onNavigate={handleNavigate}
          onFilterTasks={handleFilterTasks}
          onLogout={handleLogout}
          activeFilter={currentScreen === 'tasks' ? tasksFilter : undefined}
        />

        <div className={styles.main}>
          {currentScreen !== 'workspace' && <Header title={title} subtitle={subtitle} />}

          <div className={styles.content}>
            {currentScreen === 'dashboard' && (
              <DashboardScreen history={history} onOpenTask={handleOpenTask} />
            )}
            {currentScreen === 'tasks' && (
              <TasksListScreen key={tasksFilter} history={history} onOpenTask={handleOpenTask} initialFilter={tasksFilter} onFilterChange={setTasksFilter} />
            )}
            {currentScreen === 'history' && (
              <HistoryScreen history={history} onOpenTask={handleOpenTask} />
            )}
            {currentScreen === 'workspace' && currentTaskId && (
              <WorkspaceScreen
                taskId={currentTaskId}
                history={history}
                onBack={() => handleNavigate('tasks')}
                onSaveResult={handleSaveResult}
                onUpdateSidebar={handleUpdateSidebar}
              />
            )}
            {currentScreen === 'theory' && <TheoryScreen />}
            {currentScreen === 'profile' && (
              <ProfileScreen
                history={history}
                onOpenTask={handleOpenTask}
                onClearHistory={handleClearHistory}
              />
            )}
            {currentScreen === 'settings' && <SettingsScreen />}
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};