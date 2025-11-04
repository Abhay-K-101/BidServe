import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Bid, User, Notification } from '../types';
import { generateMockData } from '../utils/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  bids: Bid[];
  notifications: Notification[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'ownerId'>) => void;
  addBid: (bid: Omit<Bid, 'id' | 'createdAt' | 'status' | 'bidderId'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getBidsForTask: (taskId: string) => Bid[];
  getUserById: (userId: string) => User | undefined;
  getTasksForUser: (userId: string) => Task[];
  getBidsForUser: (userId: string) => Bid[];
  updateBidStatus: (bidId: string, status: 'accepted' | 'rejected') => void; // Added!
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const mockData = generateMockData();

  const [currentUser] = useState<User | null>(mockData.users[0]);
  const [users] = useState<User[]>(mockData.users);
  const [tasks, setTasks] = useState<Task[]>(mockData.tasks);
  const [bids, setBids] = useState<Bid[]>(mockData.bids);
  const [notifications, setNotifications] = useState<Notification[]>(mockData.notifications);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status' | 'ownerId'>) => {
    if (!currentUser) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      ownerId: currentUser.id,
      createdAt: new Date(),
      status: 'open',
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);
  };

  const addBid = (bidData: Omit<Bid, 'id' | 'createdAt' | 'status' | 'bidderId'>) => {
    if (!currentUser) return;

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      bidderId: currentUser.id,
      createdAt: new Date(),
      status: 'pending',
      ...bidData
    };

    setBids(prev => [newBid, ...prev]);

    // Update task with current bid
    setTasks(prev =>
      prev.map(t => {
        if (t.id === bidData.taskId) {
          return {
            ...t,
            currentBid: {
              amount: bidData.amount,
              bidderId: currentUser.id
            }
          };
        }
        return t;
      })
    );
  };

  const updateBidStatus = (bidId: string, status: 'accepted' | 'rejected') => {
    setBids(prev =>
      prev.map(bid =>
        bid.id === bidId ? { ...bid, status } : bid
      )
    );
    // Optionally, update task's currentBid if accepted
    if (status === 'accepted') {
      const acceptedBid = bids.find(bid => bid.id === bidId);
      if (acceptedBid) {
        setTasks(prev =>
          prev.map(task =>
            task.id === acceptedBid.taskId
              ? {
                  ...task,
                  currentBid: {
                    amount: acceptedBid.amount,
                    bidderId: acceptedBid.bidderId,
                  },
                }
              : task
          )
        );
      }
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  const getBidsForTask = (taskId: string) => {
    return bids.filter(bid => bid.taskId === taskId);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getTasksForUser = (userId: string) => {
    return tasks.filter(task => task.ownerId === userId);
  };

  const getBidsForUser = (userId: string) => {
    return bids.filter(bid => bid.bidderId === userId);
  };

  const value = {
    currentUser,
    users,
    tasks,
    bids,
    notifications,
    addTask,
    addBid,
    markNotificationAsRead,
    getTaskById,
    getBidsForTask,
    getUserById,
    getTasksForUser,
    getBidsForUser,
    updateBidStatus, // Make sure this is included!
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
