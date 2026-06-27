const password123 = '$2b$10$aEXZT78TO6ccNXadCpVBMOnr.lTG9Kta7XDEmwYoWmjWyzMXX/Dte';
const admin123 = '$2b$10$1Jrsm/RbbDzCkf.Plqjm4eYbrGHdtPzjcuVNLjz2y0yes011bMkia';

export interface MockUser {
  email: string;
  passwordHash: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    email: 'user@example.com',
    passwordHash: password123,
  },
  {
    email: 'admin@example.com',
    passwordHash: admin123,
  },
];
