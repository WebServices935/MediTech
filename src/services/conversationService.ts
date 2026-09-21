import { ConversationMessage, Session } from '../types';

type MessageListener = (messages: ConversationMessage[]) => void;
type SessionListener = (session: Session) => void;

class ConversationService {
  private channel: BroadcastChannel | null = null;
  private messageListeners: Set<MessageListener> = new Set();
  private sessionListeners: Set<SessionListener> = new Set();
  private currentSessionId: string = 'CONNECT-4821';

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('connectable_ai_channel');
      this.channel.onmessage = (event) => {
        if (event.data?.type === 'NEW_MESSAGE') {
          const messages = this.getMessages(this.currentSessionId);
          this.notifyMessageListeners(messages);
        } else if (event.data?.type === 'SESSION_UPDATE') {
          this.notifySessionListeners(event.data.session);
        } else if (event.data?.type === 'CLEAR_HISTORY') {
          this.notifyMessageListeners([]);
        }
      };
    }
  }

  public generateSessionId(): string {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return `CONNECT-${randomCode}`;
  }

  public getOrCreateSession(sessionId?: string): Session {
    const id = sessionId || this.currentSessionId;
    this.currentSessionId = id;
    const key = `session_${id}`;
    const existing = localStorage.getItem(key);

    if (existing) {
      try {
        return JSON.parse(existing);
      } catch (e) {
        console.error("Failed to parse stored session:", e);
      }
    }

    const newSession: Session = {
      sessionId: id,
      createdAt: Date.now(),
      participants: {
        personA: {
          id: 'personA',
          name: 'Person A',
          inputModality: 'speech',
          outputModality: 'text',
          language: 'en',
          joined: true,
          lastActive: Date.now()
        },
        personB: {
          id: 'personB',
          name: 'Person B',
          inputModality: 'text',
          outputModality: 'speech',
          language: 'en',
          joined: true,
          lastActive: Date.now()
        }
      },
      active: true
    };

    localStorage.setItem(key, JSON.stringify(newSession));
    return newSession;
  }

  public getMessages(sessionId: string): ConversationMessage[] {
    const key = `messages_${sessionId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  public addMessage(message: ConversationMessage) {
    const key = `messages_${message.sessionId}`;
    const current = this.getMessages(message.sessionId);
    const updated = [...current, message];
    localStorage.setItem(key, JSON.stringify(updated));

    if (this.channel) {
      this.channel.postMessage({ type: 'NEW_MESSAGE', sessionId: message.sessionId, message });
    }

    this.notifyMessageListeners(updated);
  }

  public clearMessages(sessionId: string) {
    const key = `messages_${sessionId}`;
    localStorage.removeItem(key);

    if (this.channel) {
      this.channel.postMessage({ type: 'CLEAR_HISTORY', sessionId });
    }

    this.notifyMessageListeners([]);
  }

  public subscribeMessages(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => {
      this.messageListeners.delete(listener);
    };
  }

  public subscribeSession(listener: SessionListener): () => void {
    this.sessionListeners.add(listener);
    return () => {
      this.sessionListeners.delete(listener);
    };
  }

  private notifyMessageListeners(messages: ConversationMessage[]) {
    this.messageListeners.forEach(listener => listener(messages));
  }

  private notifySessionListeners(session: Session) {
    this.sessionListeners.forEach(listener => listener(session));
  }
}

export const conversationService = new ConversationService();
