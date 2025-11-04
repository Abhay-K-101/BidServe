import { create } from 'zustand';
import { Task, Bid, User } from '../types';

interface BidStore {
  tasks: Task[];
  bids: Bid[];
  users: User[];
  currentUser: User | null;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addBid: (bid: Bid) => void;
  updateBid: (bidId: string, updates: Partial<Bid>) => void;
  setCurrentUser: (user: User | null) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getBidsForTask: (taskId: string) => Bid[];
  getUserById: (userId: string) => User | undefined;
}

export const useBidStore = create<BidStore>((set, get) => ({
  tasks: [],
  bids: [],
  users: [],
  currentUser: null,

  addTask: (task) => {
    set((state) => ({
      tasks: [task, ...state.tasks],
    }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  },

  addBid: (bid) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === bid.taskId);

    if (task) {
      // Update task with current bid
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                currentBid: {
                  amount: bid.amount,
                  bidderId: bid.bidderId,
                },
              }
            : t
        ),
        // Add new bid and mark previous bids as outbid
        bids: [
          bid,
          ...state.bids.map((b) =>
            b.taskId === bid.taskId && b.status === 'pending'
              ? { ...b, status: 'outbid' }
              : b
          ),
        ],
      }));
    }
  },

  updateBid: (bidId, updates) => {
    set((state) => ({
      bids: state.bids.map((bid) =>
        bid.id === bidId ? { ...bid, ...updates } : bid
      ),
    }));
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  getTaskById: (taskId) => {
    return get().tasks.find((task) => task.id === taskId);
  },

  getBidsForTask: (taskId) => {
    return get().bids.filter((bid) => bid.taskId === taskId);
  },

  getUserById: (userId) => {
    return get().users.find((user) => user.id === userId);
  },
}));