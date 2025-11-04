export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: 'physical_work' | 'homework_help' | 'house_chores' | 'tutoring' | 'other';
  location?: string;
  hourlyRate: number;
  thresholdLimit: number;
  expiresAt: Date;
  status: 'open' | 'awarded' | 'completed' | 'expired';
  createdAt: Date;
  currentBid?: {
    amount: number;
    bidderId: string;
  };
}

export interface Bid {
  id: string;
  taskId: string;
  bidderId: string;
  amount: number;
  message: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'outbid';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type: 'new-task' | 'new-bid' | 'bid-accepted' | 'task-completed' | 'outbid' | 'task-expired';
  relatedId?: string;
}