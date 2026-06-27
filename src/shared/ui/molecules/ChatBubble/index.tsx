'use client';

import styles from './styles.module.scss';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
}

export const ChatBubble = ({ role, text, streaming }: ChatBubbleProps) => {
  const isUser = role === 'user';

  return (
    <div className={`${styles.msg} ${isUser ? styles.user : styles.assistant}`}>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        {text || (streaming ? <span className={styles.cursor} /> : null)}
      </div>
    </div>
  );
};
