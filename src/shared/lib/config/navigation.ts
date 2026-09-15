export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface FilterItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Дашборд', href: '/dashboard' },
  { id: 'tasks', label: 'Задания', href: '/tasks' },
  { id: 'history', label: 'История', href: '/history' },
  { id: 'theory', label: 'Теория', href: '/theory' },
  { id: 'profile', label: 'Профиль', href: '/profile' },
  { id: 'settings', label: 'Настройки API', href: '/settings' },
];

export const FILTER_ITEMS: FilterItem[] = [
  { id: 'functional', label: 'Функциональное' },
  { id: 'api', label: 'API' },
  { id: 'ui', label: 'UI/UX' },
  { id: 'bug', label: 'Баг-репорты' },
];