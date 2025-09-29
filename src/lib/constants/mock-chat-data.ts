// File: src/lib/constants/mockChatData.ts
export interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  role: 'student' | 'instructor' | 'admin';
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  replyTo?: string; // parent message id
  reactions: {
    emoji: string;
    users: string[];
    count: number;
  }[];
  attachments?: {
    id: string;
    name: string;
    type: 'image' | 'file' | 'link';
    url: string;
    size?: number;
  }[];
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    initials: 'SJ',
    role: 'instructor',
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b123fcb2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Alex Chen',
    initials: 'AC',
    role: 'student',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Maria Garcia',
    initials: 'MG',
    role: 'student',
    isOnline: false,
  },
  {
    id: '4',
    name: 'John Smith',
    initials: 'JS',
    role: 'student',
    isOnline: true,
  },
  {
    id: '5',
    name: 'Emily Davis',
    initials: 'ED',
    role: 'admin',
    isOnline: true,
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    content: 'Good morning everyone! Today we\'ll be covering React Hooks in depth. Please make sure you have the latest version of the course materials.',
    timestamp: new Date('2024-01-15T09:00:00Z'),
    reactions: [
      { emoji: '👍', users: ['2', '3', '4'], count: 3 },
      { emoji: '📚', users: ['2'], count: 1 }
    ]
  },
  {
    id: '2',
    userId: '2',
    content: 'Thanks Sarah! I have a question about useEffect dependencies from last week\'s assignment.',
    timestamp: new Date('2024-01-15T09:05:00Z'),
    replyTo: '1',
    reactions: []
  },
  {
    id: '3',
    userId: '1',
    content: '@Alex Chen Great question! Let\'s discuss that after we cover the new material. Feel free to bring up specific examples.',
    timestamp: new Date('2024-01-15T09:07:00Z'),
    replyTo: '2',
    reactions: [
      { emoji: '👌', users: ['2', '4'], count: 2 }
    ]
  },
  {
    id: '4',
    userId: '3',
    content: 'I\'m having trouble with the custom hooks assignment. The logic seems to work but I\'m getting warning messages in the console.',
    timestamp: new Date('2024-01-15T09:15:00Z'),
    reactions: []
  },
  {
    id: '5',
    userId: '4',
    content: 'Same issue here! The warnings are about missing dependencies.',
    timestamp: new Date('2024-01-15T09:16:00Z'),
    replyTo: '4',
    reactions: [
      { emoji: '💯', users: ['3'], count: 1 }
    ]
  },
  {
    id: '6',
    userId: '5',
    content: 'I can help with that! Here\'s a quick guide I put together for common useEffect patterns.',
    timestamp: new Date('2024-01-15T09:20:00Z'),
    replyTo: '4',
    reactions: [
      { emoji: '🙏', users: ['3', '4'], count: 2 },
      { emoji: '💡', users: ['2'], count: 1 }
    ],
    attachments: [
      {
        id: 'att1',
        name: 'useEffect-patterns-guide.pdf',
        type: 'file',
        url: '/files/useEffect-guide.pdf',
        size: 245760
      }
    ]
  },
  {
    id: '7',
    userId: '2',
    content: 'This is exactly what I needed! Thank you Emily 🎉',
    timestamp: new Date('2024-01-15T09:25:00Z'),
    replyTo: '6',
    reactions: []
  }
];

export const currentUserId = '2'; // Alex Chen for demo purposes