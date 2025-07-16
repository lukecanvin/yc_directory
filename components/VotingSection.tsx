"use client";

import { useState } from 'react';
import VoteDisplay from './VoteDisplay';
import VoteButtons from './VoteButtons';
import { VotingSectionProps, VoteCounts, UserVote, VoteError } from '@/lib/types';

const VotingSection = ({
  startupId,
  userId,
  initialVotes,
  initialUserVote
}: VotingSectionProps) => {
  const [voteCounts, setVoteCounts] = useState<VoteCounts>(initialVotes);
  const [userVote, setUserVote] = useState<UserVote | null>(initialUserVote || null);
  const [error, setError] = useState<VoteError | null>(null);

  const isAuthenticated = !!userId;

  // Handle optimistic vote count updates
  const handleVoteChange = (countChanges: VoteCounts) => {
    setVoteCounts(prev => ({
      thumbsUp: Math.max(0, prev.thumbsUp + countChanges.thumbsUp),
      thumbsDown: Math.max(0, prev.thumbsDown + countChanges.thumbsDown)
    }));

    // Update user vote state optimistically
    if (countChanges.thumbsUp > 0) {
      setUserVote({ _id: userVote?._id || '', voteType: 'up' });
    } else if (countChanges.thumbsDown > 0) {
      setUserVote({ _id: userVote?._id || '', voteType: 'down' });
    } else if (countChanges.thumbsUp < 0 || countChanges.thumbsDown < 0) {
      // Vote was removed
      setUserVote(null);
    }

    // Clear any previous errors on successful vote
    setError(null);
  };

  // Handle errors from vote operations
  const handleVoteError = (voteError: VoteError) => {
    setError(voteError);
  };

  // Error message display
  const getErrorMessage = (error: VoteError): string => {
    switch (error) {
      case 'UNAUTHENTICATED':
        return 'Please sign in to vote on startups.';
      case 'STARTUP_NOT_FOUND':
        return 'This startup could not be found.';
      case 'NETWORK_ERROR':
        return 'Network error. Please try again.';
      case 'VALIDATION_ERROR':
        return 'Invalid vote data. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg border border-black-100 shadow-100">
      {/* Vote Counts - Always visible */}
      <div className="flex items-center justify-between">
        <h3 className="text-18-semibold text-black-100">Community Votes</h3>
        <VoteDisplay
          thumbsUp={voteCounts.thumbsUp}
          thumbsDown={voteCounts.thumbsDown}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-14-normal text-red-700">
            {getErrorMessage(error)}
          </p>
        </div>
      )}

      {/* Voting Buttons - Only for authenticated users */}
      {isAuthenticated ? (
        <div className="flex flex-col gap-3">
          <p className="text-14-normal text-black-300">
            Cast your vote on this startup:
          </p>
          <VoteButtons
            startupId={startupId}
            userVote={userVote}
            onVoteChange={handleVoteChange}
            onError={handleVoteError}
          />
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
          <p className="text-14-normal text-black-300 mb-2">
            Want to vote on this startup?
          </p>
          <p className="text-12-normal text-black-200">
            Sign in to share your opinion with the community.
          </p>
        </div>
      )}
    </div>
  );
};

export default VotingSection;