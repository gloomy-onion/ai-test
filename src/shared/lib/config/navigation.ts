export interface NavItem {
  id: string;
  label: string;
}

export interface FilterItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Дашборд' },
  { id: 'tasks', label: 'Задания' },
  { id: 'history', label: 'История' },
  { id: 'theory', label: 'Теория' },
  { id: 'profile', label: 'Профиль' },
  { id: 'settings', label: 'Настройки API' },
];

export const FILTER_ITEMS: FilterItem[] = [
  { id: 'functional', label: 'Функциональное' },
  { id: 'api', label: 'API' },
  { id: 'ui', label: 'UI/UX' },
  { id: 'bug', label: 'Баг-репорты' },
];