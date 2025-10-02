export type User = {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  isAdmin?: boolean;
};

export type MediaType = 'banner' | 'image' | 'video' | 'file' | 'gallery';

export type Media = {
  type: MediaType;
  url: string | string[];
  thumbnail?: string;
  caption?: string;
  title?: string;
  fileName?: string;
  fileSize?: string;
};

export type Reaction = {
  type: '👍' | '❤️' | '💡' | '🎉' | '🔥';
  count: number;
  userReacted: boolean;
};

export type Attachment = {
  id: string;
  type: 'image' | 'pdf';
  url: string;
  name: string;
};

export type Comment = {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  userLiked: boolean;
  replies?: Comment[];
  attachments?: Attachment[];
};

export type Post = {
  id: string;
  author: User;
  timestamp: string;
  location?: string;
  title?: string;
  content: string;
  media?: Media;
  reactions: Reaction[];
  totalReactions: number;
  commentsCount: number;
  comments: Comment[];
  shares: number;
  views: number;
  isPinned?: boolean;
  isSaved?: boolean;
  commentsDisabled?: boolean;
};

export type FilterType = 'all' | 'my-posts' | 'saved';
