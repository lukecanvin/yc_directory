import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .url()
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }),
  pitch: z.string().min(10),
});

// Vote validation schemas
export const voteSubmissionSchema = z.object({
  startupId: z.string().min(1, "Startup ID is required"),
  voteType: z.enum(["up", "down"], {
    required_error: "Vote type must be either 'up' or 'down'",
  }),
});

export const voteRemovalSchema = z.object({
  startupId: z.string().min(1, "Startup ID is required"),
});

export const getUserVoteSchema = z.object({
  startupId: z.string().min(1, "Startup ID is required"),
  userId: z.string().min(1, "User ID is required"),
});
