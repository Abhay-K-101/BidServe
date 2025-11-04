import { User, Task, Bid, Notification } from '../types';

export const generateMockData = () => {
  // Mock Users
  const users: User[] = [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'john@example.com',
      profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'user-2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      createdAt: new Date('2024-02-20')
    },
    {
      id: 'user-3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      createdAt: new Date('2024-03-10')
    },
    {
      id: 'user-4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      createdAt: new Date('2024-03-15')
    },
    {
      id: 'user-5',
      name: 'David Miller',
      email: 'david@example.com',
      profilePicture: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      createdAt: new Date('2024-03-20')
    }
  ];

  // Set expiration time to 24 hours from now
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Mock Tasks
  const tasks: Task[] = [
    {
      id: 'task-1',
      ownerId: 'user-1',
      title: 'Help Moving Furniture',
      description: 'Need help moving furniture from a 2-bedroom apartment to a new house. Must be able to lift heavy items.',
      category: 'physical_work',
      location: 'Downtown Area',
      hourlyRate: 30,
      thresholdLimit: 20,
      expiresAt: expirationTime,
      createdAt: new Date(),
      status: 'open'
    },
    {
      id: 'task-2',
      ownerId: 'user-2',
      title: 'Math Homework Help',
      description: 'Need assistance with college-level calculus homework. Must be good at explaining concepts.',
      category: 'homework_help',
      hourlyRate: 25,
      thresholdLimit: 15,
      expiresAt: expirationTime,
      createdAt: new Date(),
      status: 'open'
    },
    {
      id: 'task-3',
      ownerId: 'user-3',
      title: 'House Deep Cleaning',
      description: 'Looking for someone to do a thorough cleaning of a 3-bedroom house, including windows and carpets.',
      category: 'house_chores',
      location: 'Suburban Area',
      hourlyRate: 28,
      thresholdLimit: 18,
      expiresAt: expirationTime,
      createdAt: new Date(),
      status: 'open'
    }
  ];

  // Mock Bids
  const bids: Bid[] = [
    {
      id: 'bid-1',
      taskId: 'task-1',
      bidderId: 'user-4',
      amount: 25,
      message: "I have experience moving furniture and can help you with this task. Available this weekend.",
      createdAt: new Date(),
      status: 'pending'
    },
    {
      id: 'bid-2',
      taskId: 'task-2',
      bidderId: 'user-5',
      amount: 22,
      message: "I'm a math tutor with 3 years of experience. I can help you understand the concepts clearly.",
      createdAt: new Date(),
      status: 'pending'
    }
  ];

  // Mock Notifications
  const notifications: Notification[] = [
    {
      id: 'notification-1',
      userId: 'user-1',
      message: 'New bid on your task: Help Moving Furniture',
      isRead: false,
      createdAt: new Date(),
      type: 'new-bid',
      relatedId: 'bid-1'
    },
    {
      id: 'notification-2',
      userId: 'user-2',
      message: 'New bid on your task: Math Homework Help',
      isRead: false,
      createdAt: new Date(),
      type: 'new-bid',
      relatedId: 'bid-2'
    }
  ];

  return { users, tasks, bids, notifications };
};