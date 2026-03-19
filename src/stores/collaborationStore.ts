import { create } from 'zustand';

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  cursorX: number;
  cursorY: number;
  avatar?: string;
}

export interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  userId: string;
}

const USER_COLORS = [
  '#926B7F', '#BFA6B3', '#34D399', '#FBBF24', '#F87171',
  '#9E798C', '#60A5FA', '#FB923C', '#2DD4BF', '#EBCCDC',
];

function getStoredName(): string {
  try {
    return localStorage.getItem('playspace-username') || '';
  } catch {
    return '';
  }
}

function getStoredColor(): string {
  try {
    const c = localStorage.getItem('playspace-usercolor');
    if (c) return c;
  } catch {}
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

function getStoredUserId(): string {
  try {
    const id = localStorage.getItem('playspace-userid');
    if (id) return id;
  } catch {}
  const newId = `user-${Math.random().toString(36).slice(2, 8)}`;
  try { localStorage.setItem('playspace-userid', newId); } catch {}
  return newId;
}

interface CollaborationState {
  users: CollabUser[];
  reactions: Reaction[];
  isPassTheCanvasMode: boolean;
  currentTurnUserId: string | null;
  localUserId: string;
  localUserName: string;
  localUserColor: string;
  roomId: string | null;
  isConnected: boolean;
  needsNameEntry: boolean;

  addUser: (user: CollabUser) => void;
  removeUser: (id: string) => void;
  updateUserCursor: (id: string, x: number, y: number) => void;
  addReaction: (reaction: Reaction) => void;
  removeReaction: (id: string) => void;
  setPassTheCanvasMode: (active: boolean) => void;
  setCurrentTurn: (userId: string | null) => void;
  setLocalUserName: (name: string) => void;
  setLocalUserColor: (color: string) => void;
  setRoomId: (roomId: string | null) => void;
  setConnected: (connected: boolean) => void;
  setNeedsNameEntry: (needs: boolean) => void;
  setUsers: (users: CollabUser[]) => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  users: [],
  reactions: [],
  isPassTheCanvasMode: false,
  currentTurnUserId: null,
  localUserId: getStoredUserId(),
  localUserName: getStoredName(),
  localUserColor: getStoredColor(),
  roomId: null,
  isConnected: false,
  needsNameEntry: !getStoredName(),

  addUser: (user) => set((s) => {
    if (s.users.some(u => u.id === user.id)) return s;
    return { users: [...s.users, user] };
  }),
  removeUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
  updateUserCursor: (id, x, y) =>
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, cursorX: x, cursorY: y } : u)),
    })),
  addReaction: (reaction) => set((s) => ({ reactions: [...s.reactions, reaction] })),
  removeReaction: (id) => set((s) => ({ reactions: s.reactions.filter((r) => r.id !== id) })),
  setPassTheCanvasMode: (active) => set({ isPassTheCanvasMode: active }),
  setCurrentTurn: (userId) => set({ currentTurnUserId: userId }),
  setLocalUserName: (name) => {
    try { localStorage.setItem('playspace-username', name); } catch {}
    set({ localUserName: name, needsNameEntry: false });
  },
  setLocalUserColor: (color) => {
    try { localStorage.setItem('playspace-usercolor', color); } catch {}
    set({ localUserColor: color });
  },
  setRoomId: (roomId) => set({ roomId }),
  setConnected: (connected) => set({ isConnected: connected }),
  setNeedsNameEntry: (needs) => set({ needsNameEntry: needs }),
  setUsers: (users) => set({ users }),
}));
