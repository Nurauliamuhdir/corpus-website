
import { Journal, ActivityItem, SiteSettings } from '../../types';

type AppState = {
  journals: Journal[];
  activities: ActivityItem[];
  settings: SiteSettings;
};

type SocketMessage = 
  | { type: 'INIT'; data: AppState }
  | { type: 'STATE_UPDATED'; data: AppState }
  | { type: 'UPDATE_STATE'; data: Partial<AppState> };

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: ((state: AppState) => void)[] = [];
  private currentState: AppState | null = null;

  connect() {
    if (this.socket) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.socket = new WebSocket(`${protocol}//${host}`);

    this.socket.onmessage = (event) => {
      const message: SocketMessage = JSON.parse(event.data);
      if (message.type === 'INIT' || message.type === 'STATE_UPDATED') {
        this.currentState = message.data;
        this.notifyListeners(message.data);
        
        // Also sync to localStorage for backward compatibility/offline fallback
        localStorage.setItem('db_journals', JSON.stringify(message.data.journals));
        localStorage.setItem('db_activities', JSON.stringify(message.data.activities));
        localStorage.setItem('db_settings', JSON.stringify(message.data.settings));
        window.dispatchEvent(new Event('storage'));
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      setTimeout(() => this.connect(), 3000); // Reconnect
    };
  }

  updateState(data: Partial<AppState>) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'UPDATE_STATE', data }));
    }
  }

  subscribe(callback: (state: AppState) => void) {
    this.listeners.push(callback);
    if (this.currentState) callback(this.currentState);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(state: AppState) {
    this.listeners.forEach(l => l(state));
  }
}

export const socketService = new SocketService();
