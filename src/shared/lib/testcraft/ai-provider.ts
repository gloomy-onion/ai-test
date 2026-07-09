import type { AIProvider, FeedbackResult, Task } from './types';

export const PROVIDERS: Record<string, AIProvider> = {
  claude: {
    name: 'Claude',
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    keyHint: 'sk-ant-...',
    free: false,
  },
  gemini: {
    name: 'Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-1.5-flash',
    keyHint: 'AIza...',
    free: true,
  },
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    keyHint: 'gsk_...',
    free: true,
  },
  openai: {
    name: 'ChatGPT',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    keyHint: 'sk-...',
    free: false,
  },
  deepseek: {
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    keyHint: 'sk-...',
    free: false,
  },
};

export function getProvider(): string {
  if (typeof window === 'undefined') {
    return 'claude';
  }

  return localStorage.getItem('tc_provider') || 'claude';
}

export function setProvider(id: string): void {
  localStorage.setItem('tc_provider', id);
}

export function getApiKey(provider?: string): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const prov = provider || getProvider();

  return localStorage.getItem(`tc_apikey_${prov}`) || '';
}

export function setApiKey(provider: string, key: string): void {
  if (key) {
    localStorage.setItem(`tc_apikey_${provider}`, key);
  } else {
    localStorage.removeItem(`tc_apikey_${provider}`);
  }
}

export function removeApiKey(provider: string): void {
  localStorage.removeItem(`tc_apikey_${provider}`);
}

export function buildPrompt(task: Task, answer: string): string {
  return `Ты опытный QA-наставник. Оцени работу начинающего тестировщика.

ЗАДАНИЕ:
Тип документа: ${task.docLabel}
Описание: ${task.desc}
Требования к системе: ${task.requirement}

РАБОТА СТУДЕНТА:
${answer}

Дай детальную оценку на русском языке. Ответь ТОЛЬКО в формате JSON (без markdown-обёртки):
{
  "score": число от 0 до 100,
  "coverage": число от 0 до 100,
  "quality": число от 0 до 100,
  "summary": "краткий вывод 1-2 предложения",
  "good": ["что сделано хорошо, 2-4 пункта"],
  "missing": ["что пропущено или неверно, 2-5 пунктов"],
  "tips": ["конкретные советы по улучшению, 2-3 пункта"]
}`;
}

export async function callClaude(prompt: string): Promise<FeedbackResult> {
  const provId = getProvider();
  const prov = PROVIDERS[provId];
  const key = getApiKey();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  let body: string;
  if (provId === 'claude') {
    if (key) {
      headers['x-api-key'] = key;
    }
    body = JSON.stringify({
      model: prov.model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
  } else {
    if (!key) {
      throw new Error('Добавьте API-ключ в Настройках API');
    }
    headers.Authorization = `Bearer ${key}`;
    body = JSON.stringify({
      model: prov.model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
  }

  const response = await fetch(prov.url, { method: 'POST', headers, body });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg =
      (err as { error?: { message?: string }; message?: string })?.error?.message ||
      (err as { message?: string })?.message ||
      response.status;
    if (response.status === 401) {
      throw new Error('Неверный API-ключ. Проверьте Настройки API.');
    }
    if (response.status === 429) {
      throw new Error('Превышен лимит запросов. Попробуйте позже.');
    }
    throw new Error(`Ошибка API: ${msg}`);
  }

  const data = await response.json();
  const text: string =
    provId === 'claude'
      ? data.content.map((c: { text?: string }) => c.text || '').join('')
      : data.choices?.[0]?.message?.content || '';

  let clean = text.replaceAll(/```json|```/g, '').trim();
  const s = clean.indexOf('{');
  const e = clean.lastIndexOf('}');
  if (s !== -1 && e !== -1) {
    clean = clean.slice(s, e + 1);
  }

  return JSON.parse(clean);
}

export async function testApiConnection(
  provider: string,
  key: string,
): Promise<{ ok: boolean; message: string }> {
  const prov = PROVIDERS[provider];
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body: string;

  if (provider === 'claude') {
    if (key) {
      headers['x-api-key'] = key;
    }
    body = JSON.stringify({
      model: prov.model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    });
  } else {
    if (!key) {
      return { ok: false, message: 'Введите API-ключ' };
    }
    headers.Authorization = `Bearer ${key}`;
    body = JSON.stringify({
      model: prov.model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    });
  }

  try {
    const res = await fetch(prov.url, { method: 'POST', headers, body });
    if (res.ok) {
      return {
        ok: true,
        message: `✓ Соединение установлено! Провайдер ${prov.name} работает.`,
      };
    }
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { error?: { message?: string }; message?: string })?.error?.message || res.status;

    return { ok: false, message: `✗ Ошибка: ${msg}` };
  } catch (error) {
    return {
      ok: false,
      message: `✗ ${error instanceof Error ? error.message : 'Network error'}`,
    };
  }
}

export async function askTheoryQuestion(q: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Ты опытный QA-наставник. Ответь на вопрос начинающего тестировщика ясно, конкретно, с примерами где нужно. Отвечай на русском. Не более 300 слов.\n\nВопрос: ${q}`,
        },
      ],
    }),
  });
  const data = await response.json();

  return data.content
    .map((c: { text?: string }) => c.text || '')
    .join('')
    .trim();
}

export async function getHint(task: Task, answer: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Задание: ${task.desc}\nТип документа: ${task.docLabel}\nТребования: ${task.requirement}\n\nТекущий ответ студента:\n${answer || '(пусто)'}\n\nДай краткую подсказку (не решение!): что стоит добавить или проверить? 3-4 предложения на русском.`,
        },
      ],
    }),
  });
  const data = await response.json();

  return data.content
    .map((c: { text?: string }) => c.text || '')
    .join('')
    .trim();
}

export function scoreColor(n: number): string {
  if (n >= 80) {
    return 'score-green';
  }
  if (n >= 55) {
    return 'score-amber';
  }

  return 'score-red';
}
