// Vote-related TypeScript interfaces and types

export interface VoteCounts {
  thumbsUp: number;
  thumbsDown: number;
}

export interface UserVote {
  _id: string;
  voteType: 'up' | 'down' | null;
}

export interface VoteSubmission {
  startupId: string;
  voteType: 'up' | 'down';
}

export interface VoteRemoval {
  startupId: string;
}

export interface GetUserVoteParams {
  startupId: string;
  userId: string;
}

// Component prop types
export interface VoteDisplayProps {
  thumbsUp: number;
  thumbsDown: number;
}

export interface VoteButtonsProps {
  startupId: string;
  userVote?: UserVote | null;
  onVoteChange?: (newCounts: VoteCounts) => void;
  onError?: (error: VoteError) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface VotingSectionProps {
  startupId: string;
  userId?: string;
  initialVotes: VoteCounts;
  initialUserVote?: UserVote | null;
}

// Error types for vote operations
export type VoteError = 
  | 'UNAUTHENTICATED'
  | 'STARTUP_NOT_FOUND' 
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

export interface VoteActionResult {
  success: boolean;
  error?: VoteError;
  data?: VoteCounts | UserVote | null;
}

// State types for vote components
export interface VoteState {
  counts: VoteCounts;
  userVote: UserVote | null;
  isLoading: boolean;
  error: VoteError | null;
}

// Utility types
export type VoteType = 'up' | 'down';

// Type guards for runtime type checking
export const isValidVoteType = (value: string): value is VoteType => {
  return value === 'up' || value === 'down';
};

export const isVoteError = (value: string): value is VoteError => {
  return ['UNAUTHENTICATED', 'STARTUP_NOT_FOUND', 'NETWORK_ERROR', 'VALIDATION_ERROR', 'UNKNOWN_ERROR'].includes(value);
};

// Re-export Sanity generated types for convenience
export type { 
  Vote, 
  STARTUP_VOTE_COUNTS_QUERYResult, 
  USER_VOTE_QUERYResult 
} from '@/sanity/types';