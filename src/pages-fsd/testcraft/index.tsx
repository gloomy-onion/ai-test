'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadHistory, saveHistory } from '@/shared/lib/testcraft/storage';
import type { HistoryEntry } from '@/shared/lib/testcraft/types';
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

export const TestCraftPage = ({ authUser }: TestCraftPageProps) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [tasksFilter, setTasksFilter] = useState('all');

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleNavigate = useCallback((name: string) => {
    setCurrentScreen(name as ScreenName);
  }, []);

  const handleOpenTask = useCallback((id: number) => {
    setCurrentTaskId(id);
    setCurrentScreen('workspace');
  }, []);

  const handleSaveResult = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev];
      saveHistory(updated);
      return updated;
    });
  }, []);

  const handleUpdateSidebar = useCallback(() => {
    // sidebar reads from history prop, re-render is automatic
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const handleFilterTasks = useCallback((type: string) => {
    setTasksFilter(type);
    setCurrentScreen('tasks');
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/auth';
  }, []);

  const [title, subtitle] =
    currentScreen === 'workspace' ? ['', ''] : SCREEN_TITLES[currentScreen] || ['', ''];

  return (
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
  );
};
