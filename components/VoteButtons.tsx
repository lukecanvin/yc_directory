"use client";

import { useState, useTransition } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { submitVote, removeVote } from '@/lib/actions';
import { VoteButtonsProps, VoteType } from '@/lib/types';
import { cn } from '@/lib/utils';

const VoteButtons = ({ 
  startupId, 
  userVote, 
  onVoteChange, 
  disabled = false 
}: VoteButtonsProps) => {
  const [isPending, startTransition] = useTransition();
  const [loadingVote, setLoadingVote] = useState<VoteType | null>(null);

  const handleVoteClick = async (voteType: VoteType) => {
    if (disabled || isPending) return;

    setLoadingVote(voteType);
    
    startTransition(async () => {
      try {
        const currentUserVote = userVote?.voteType;
        
        if (currentUserVote === voteType) {
          // User clicked the same vote button - remove vote
          const result = await removeVote({ startupId });
          
          if (result.success && onVoteChange) {
            // Optimistically update the UI
            const newCounts = currentUserVote === 'up' 
              ? { thumbsUp: -1, thumbsDown: 0 }
              : { thumbsUp: 0, thumbsDown: -1 };
            onVoteChange(newCounts);
          }
        } else {
          // User clicked different vote button or no existing vote - submit vote
          const result = await submitVote({ startupId, voteType });
          
          if (result.success && onVoteChange) {
            // Optimistically update the UI
            let newCounts = { thumbsUp: 0, thumbsDown: 0 };
            
            if (currentUserVote) {
              // User is changing their vote
              if (currentUserVote === 'up' && voteType === 'down') {
                newCounts = { thumbsUp: -1, thumbsDown: 1 };
              } else if (currentUserVote === 'down' && voteType === 'up') {
                newCounts = { thumbsUp: 1, thumbsDown: -1 };
              }
            } else {
              // User is voting for the first time
              newCounts = voteType === 'up' 
                ? { thumbsUp: 1, thumbsDown: 0 }
                : { thumbsUp: 0, thumbsDown: 1 };
            }
            
            onVoteChange(newCounts);
          }
        }
      } catch (error) {
        console.error('Error handling vote:', error);
      } finally {
        setLoadingVote(null);
      }
    });
  };

  const isThumbsUpActive = userVote?.voteType === 'up';
  const isThumbsDownActive = userVote?.voteType === 'down';
  const isThumbsUpLoading = loadingVote === 'up';
  const isThumbsDownLoading = loadingVote === 'down';

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Thumbs Up Button */}
      <button
        onClick={() => handleVoteClick('up')}
        disabled={disabled || isPending}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 transition-all duration-200",
          "hover:shadow-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed font-work-sans font-medium",
          isThumbsUpActive
            ? "bg-green-600 border-green-600 text-white shadow-100"
            : "bg-white border-black-300 text-black-300 hover:bg-green-50 hover:border-green-600 hover:text-green-600"
        )}
        aria-label={isThumbsUpActive ? "Remove thumbs up vote" : "Vote thumbs up"}
        aria-pressed={isThumbsUpActive}
      >
        {isThumbsUpLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ThumbsUp 
            className={cn(
              "size-4",
              isThumbsUpActive ? "fill-green-200" : ""
            )} 
          />
        )}
        <span className="text-14-normal">
          {isThumbsUpActive ? "Voted" : "Up"}
        </span>
      </button>

      {/* Thumbs Down Button */}
      <button
        onClick={() => handleVoteClick('down')}
        disabled={disabled || isPending}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 transition-all duration-200",
          "hover:shadow-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed font-work-sans font-medium",
          isThumbsDownActive
            ? "bg-red-600 border-red-600 text-white shadow-100"
            : "bg-white border-black-300 text-black-300 hover:bg-red-50 hover:border-red-600 hover:text-red-600"
        )}
        aria-label={isThumbsDownActive ? "Remove thumbs down vote" : "Vote thumbs down"}
        aria-pressed={isThumbsDownActive}
      >
        {isThumbsDownLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ThumbsDown 
            className={cn(
              "size-4",
              isThumbsDownActive ? "fill-red-200" : ""
            )} 
          />
        )}
        <span className="text-14-normal">
          {isThumbsDownActive ? "Voted" : "Down"}
        </span>
      </button>
    </div>
  );
};

export default VoteButtons;