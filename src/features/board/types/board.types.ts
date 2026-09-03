export type BoardCategory = 'ALL' | 'HOT' | 'ANALYSIS' | 'POLL' | 'QNA';

export interface BoardPost {
  id: string;
  category: 'HOT' | 'ANALYSIS' | 'POLL' | 'QNA';
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  isReporterVerified: boolean;
  pressMediaName?: string;
  authorRoiPct: number;
  taggedPoliticianId?: string;
  taggedPoliticianName?: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  views: number;
  createdAt: string;
}

export interface PollOption {
  id: string;
  politicianName: string;
  party: string;
  votes: number;
}

export interface WeeklyPoll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}
