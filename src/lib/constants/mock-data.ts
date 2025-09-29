export interface User {
  id: string;
  name: string;
  image: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  members: User[];
  maxMembers?: number;
  createdBy: User;
  createdAt: string;
  isPrivate: boolean;
  tags?: string[];
  isOwner?: boolean;
  isMember?: boolean;
}

// Mock users with real images
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Emma Thompson",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "John Smith",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Alex Kumar",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "Lisa Wang",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "7",
    name: "James Wilson",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "8",
    name: "Maria Garcia",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "9",
    name: "David Park",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "10",
    name: "Sophie Miller",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "11",
    name: "Ryan Taylor",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "12",
    name: "Nina Patel",
    image:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop&crop=face",
  },
];

// Helper function to get random users
const getRandomUsers = (count: number, exclude?: string[]): User[] => {
  const availableUsers = mockUsers.filter(
    (user) => !exclude?.includes(user.id)
  );
  const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Sample rooms data
export const sampleRooms: Room[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    description:
      "Deep dive into advanced React patterns including hooks, context, and performance optimization techniques.",
    members: getRandomUsers(12, ["1"]),
    maxMembers: 20,
    createdBy: mockUsers[0], // Sarah Chen
    createdAt: "2 days ago",
    isPrivate: false,
    tags: ["React", "JavaScript", "Frontend"],
    isOwner: false,
    isMember: true,
  },
  {
    id: "2",
    title: "Machine Learning Study Group",
    description:
      "Weekly discussions on ML algorithms, papers, and practical implementations using Python and TensorFlow.",
    members: getRandomUsers(8, ["1"]),
    maxMembers: 15,
    createdBy: mockUsers[1], // Dr. Michael Rodriguez
    createdAt: "5 days ago",
    isPrivate: true,
    tags: ["ML", "Python", "TensorFlow", "AI"],
    isOwner: true,
    isMember: true,
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    description:
      "Learn modern design principles, create beautiful interfaces, and improve user experience design skills.",
    members: getRandomUsers(15, ["2"]),
    maxMembers: 25,
    createdBy: mockUsers[2], // Emma Thompson
    createdAt: "1 week ago",
    isPrivate: false,
    tags: ["Design", "UI/UX", "Figma"],
    isOwner: false,
    isMember: false,
  },
  {
    id: "4",
    title: "Data Structures & Algorithms",
    description:
      "Master DSA concepts through collaborative problem solving and code reviews. Perfect for interview prep.",
    members: getRandomUsers(20, ["3"]),
    maxMembers: 30,
    createdBy: mockUsers[3], // John Smith
    createdAt: "3 days ago",
    isPrivate: false,
    tags: ["DSA", "Programming", "Interview"],
    isOwner: false,
    isMember: true,
  },
  {
    id: "5",
    title: "Blockchain Development",
    description:
      "Explore blockchain technology, smart contracts, and decentralized applications using Solidity and Web3.",
    members: getRandomUsers(6, ["4"]),
    maxMembers: 12,
    createdBy: mockUsers[4], // Alex Kumar
    createdAt: "1 day ago",
    isPrivate: true,
    tags: ["Blockchain", "Solidity", "Web3"],
    isOwner: false,
    isMember: false,
  },
  {
    id: "6",
    title: "System Design Interviews",
    description:
      "Practice system design problems and learn how to architect scalable distributed systems.",
    members: getRandomUsers(18, ["5"]),
    createdBy: mockUsers[5], // Lisa Wang
    createdAt: "6 days ago",
    isPrivate: false,
    tags: ["System Design", "Architecture", "Interview"],
    isOwner: true,
    isMember: true,
  },
];
