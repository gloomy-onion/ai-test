export const getUserInitials = (name: string): string => {
  if (name.includes('@')) {
    name = name.split('@')[0];
  }

  const parts = name.split(/[\s._-]+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  const first = parts[0].charAt(0);
  const second = parts.length > 1 ? parts[1].charAt(0) : first;

  return (first + second).toUpperCase();
};