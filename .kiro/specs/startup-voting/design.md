# Design Document

## Overview

The startup voting system enables authenticated users to vote thumbs up or thumbs down on startup pitches. The system ensures one vote per user per pitch while allowing vote changes, and displays vote counts to all users on pitch detail pages. The design integrates with the existing Next.js 15 + Sanity CMS architecture using NextAuth.js for authentication.

## Architecture

### Data Storage Strategy
- **Primary Storage**: Sanity CMS for vote data persistence
- **Vote Document Structure**: Separate vote documents linking users to startups
- **Aggregation**: Real-time vote count calculation via GROQ queries
- **Authentication**: NextAuth.js session-based user identification

### Component Architecture
```
StartupDetailPage
├── VotingSection (authenticated users only)
│   ├── VoteButtons (thumbs up/down)
│   └── VoteDisplay (counts for all users)
└── ExistingContent
```

## Components and Interfaces

### 1. Vote Data Model (Sanity Schema)

**New Schema: `vote.ts`**
```typescript
{
  _type: "vote",
  user: Reference<Author>,
  startup: Reference<Startup>, 
  voteType: "up" | "down",
  _createdAt: string,
  _updatedAt: string
}
```

**Unique Constraint**: Combination of user + startup ensures one vote per user per pitch

### 2. Vote Component Interface

**VotingSection Component**
- Props: `{ startupId: string, userId?: string, initialVotes: VoteCounts }`
- State: Current user vote, vote counts, loading states
- Handles: Vote submission, optimistic updates, error states

**VoteDisplay Component**  
- Props: `{ thumbsUp: number, thumbsDown: number }`
- Renders: Vote counts with icons for all users

### 3. Server Actions

**Vote Management Actions**
```typescript
// lib/actions.ts additions
export const submitVote = async (startupId: string, voteType: 'up' | 'down')
export const removeVote = async (startupId: string)
export const getUserVote = async (startupId: string, userId: string)
```

### 4. GROQ Queries

**Vote Data Queries**
```typescript
// Get vote counts for a startup
STARTUP_VOTE_COUNTS_QUERY = `
  *[_type == "startup" && _id == $startupId][0]{
    "thumbsUp": count(*[_type == "vote" && startup._ref == ^._id && voteType == "up"]),
    "thumbsDown": count(*[_type == "vote" && startup._ref == ^._id && voteType == "down"])
  }
`

// Get user's vote for a startup  
USER_VOTE_QUERY = `
  *[_type == "vote" && user._ref == $userId && startup._ref == $startupId][0]{
    voteType
  }
`
```

## Data Models

### Vote Schema Definition
```typescript
// sanity/schemaTypes/vote.ts
export const vote = defineType({
  name: "vote",
  title: "Vote", 
  type: "document",
  fields: [
    defineField({
      name: "user",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "startup", 
      type: "reference",
      to: { type: "startup" },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "voteType",
      type: "string",
      options: {
        list: [
          { title: "Thumbs Up", value: "up" },
          { title: "Thumbs Down", value: "down" }
        ]
      },
      validation: (Rule) => Rule.required()
    })
  ]
});
```

### TypeScript Interfaces
```typescript
// Types for vote data
export interface VoteCounts {
  thumbsUp: number;
  thumbsDown: number;
}

export interface UserVote {
  voteType: 'up' | 'down';
}

export interface VoteSubmission {
  startupId: string;
  voteType: 'up' | 'down';
}
```

## Error Handling

### Client-Side Error Handling
- **Network Errors**: Retry mechanism with exponential backoff
- **Authentication Errors**: Redirect to sign-in with return URL
- **Validation Errors**: Display inline error messages
- **Optimistic Updates**: Rollback on failure with user notification

### Server-Side Error Handling
- **Duplicate Vote Prevention**: Upsert operations for vote changes
- **Invalid References**: Validate startup and user existence
- **Sanity Write Errors**: Proper error logging and user feedback
- **Session Validation**: Verify user authentication before vote operations

### Error States
```typescript
type VoteError = 
  | 'UNAUTHENTICATED'
  | 'STARTUP_NOT_FOUND' 
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';
```

## Validation Strategy

### Data Validation
- **Vote Schema**: Ensure valid vote types and required references
- **User Authentication**: Verify user session before vote operations
- **Startup Existence**: Validate startup exists before accepting votes
- **Duplicate Prevention**: Handle vote changes and removals properly

## Implementation Considerations

### Performance Optimizations
- **Optimistic Updates**: Immediate UI feedback before server confirmation
- **Query Optimization**: Efficient GROQ queries for vote aggregation
- **Caching Strategy**: Consider vote count caching for high-traffic pitches
- **Batch Operations**: Group multiple vote operations when possible

### Security Measures
- **Server-Side Validation**: All vote operations validated on server
- **User Authorization**: Verify user owns session before accepting votes
- **Rate Limiting**: Prevent vote spam through request throttling
- **Data Sanitization**: Validate all inputs before database operations

### Accessibility
- **Keyboard Navigation**: Vote buttons accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels for vote states
- **Visual Indicators**: Clear visual feedback for vote states
- **Color Independence**: Don't rely solely on color for vote indication

### Mobile Responsiveness
- **Touch Targets**: Adequate button sizes for mobile interaction
- **Responsive Layout**: Vote section adapts to different screen sizes
- **Performance**: Optimized for mobile network conditions