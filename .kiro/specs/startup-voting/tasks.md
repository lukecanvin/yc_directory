# Implementation Plan

- [x] 1. Create vote schema and update Sanity configuration
  - Add vote schema definition to Sanity with user, startup, and voteType fields
  - Update schema index to include the new vote type
  - Run typegen to generate TypeScript types for vote data
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [x] 2. Create GROQ queries for vote operations
  - Write query to get vote counts for a specific startup
  - Write query to get user's existing vote for a startup
  - Add queries to the main queries file with proper TypeScript types
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 3. Implement server actions for vote management
  - Create submitVote action to handle vote creation and updates
  - Create removeVote action to handle vote deletion
  - Create getUserVote action to retrieve user's current vote
  - Add proper error handling and authentication checks
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

- [x] 4. Add TypeScript interfaces and validation





  - Create TypeScript interfaces for vote-related data types
  - Add validation schemas for vote submission data
  - Update existing type definitions to include vote-related types
  - Ensure type safety across all vote-related components
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 5. Create vote display component
  - Build VoteDisplay component to show thumbs up and down counts
  - Add proper styling with Tailwind CSS classes
  - Include thumbs up and thumbs down icons using Lucide React
  - Make component responsive for different screen sizes
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 6. Create voting buttons component
  - Build VoteButtons component with thumbs up and down buttons
  - Implement active state styling for user's current vote
  - Add loading states during vote submission
  - Handle click events for vote submission (clicking a non-active button) and removal (clicking an active button)
  - _Requirements: 1.1, 1.2, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

- [ ] 7. Create main voting section component
  - Build VotingSection component that combines vote display and buttons
  - Implement authentication check to show/hide voting buttons
  - Add optimistic updates for immediate UI feedback
  - Handle error states and display appropriate messages
  - _Requirements: 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 3.4, 4.3_

- [ ] 8. Integrate voting section into startup detail page
  - Import and add VotingSection component to startup detail page
  - Fetch initial vote data and user's existing vote
  - Position voting section appropriately within the page layout
  - Ensure voting only appears on detail pages, not in card views
  - _Requirements: 5.1, 5.2, 5.3_