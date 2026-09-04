export interface PulseVoteRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  date: string; // YYYY-MM-DD
  bestPoliticianIds: string[];
  worstPoliticianIds: string[];
  oneLineReview?: string;
  likes: number;
  createdAt: string;
}

export interface PoliticianVoteCount {
  politicianId: string;
  politicianName: string;
  party: string;
  imageUrl: string;
  voteCount: number;
}

export interface WeeklyPulseSummary {
  startDate: string;
  endDate: string;
  totalVotesCount: number;
  bestTop3: PoliticianVoteCount[];
  worstTop3: PoliticianVoteCount[];
  bestReviews: PulseVoteRecord[];
}
