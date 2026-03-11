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

interface CollaborationState {
  users: CollabUser[];
  reactions: Reaction[];
  isPassTheCanvasMode: boolean;
  currentTurnUserId: string | null;
  localUserId: string;

  addUser: (user: CollabUser) => void;
  removeUser: (id: string) => void;
  updateUserCursor: (id: string, x: number, y: number) => void;
  addReaction: (reaction: Reaction) => void;
  removeReaction: (id: string) => void;
  setPassTheCanvasMode: (active: boolean) => void;
  setCurrentTurn: (userId: string | null) => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  users: [],
  reactions: [],
  isPassTheCanvasMode: false,
  currentTurnUserId: null,
  localUserId: `user-${Math.random().toString(36).slice(2, 8)}`,

  addUser: (user) => set((s) => ({ users: [...s.users, user] })),
  removeUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
  updateUserCursor: (id, x, y) =>
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, cursorX: x, cursorY: y } : u)),
    })),
  addReaction: (reaction) => set((s) => ({ reactions: [...s.reactions, reaction] })),
  removeReaction: (id) => set((s) => ({ reactions: s.reactions.filter((r) => r.id !== id) })),
  setPassTheCanvasMode: (active) => set({ isPassTheCanvasMode: active }),
  setCurrentTurn: (userId) => set({ currentTurnUserId: userId }),
}));
