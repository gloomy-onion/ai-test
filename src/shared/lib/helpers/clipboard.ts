export const writeClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text.trim());
  } catch {
    throw new Error('Clipboard error');
  }
};

export const readClipboard = async (): Promise<string> => {
  const text = await navigator.clipboard.readText();
  if (!text.trim()) {
    throw new Error('Clipboard is empty');
  }

  return text;
};
