"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { USER_VOTE_QUERY } from "@/sanity/lib/queries";
import { voteSubmissionSchema, voteRemovalSchema, getUserVoteSchema } from "./validation";
import type { VoteActionResult, VoteSubmission, VoteRemoval, GetUserVoteParams } from "./types";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({
      _type: "startup",
      ...startup,
    });

    return parseServerActionResponse({
      ...result,
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    console.error("Error creating pitch:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const submitVote = async (data: VoteSubmission): Promise<VoteActionResult> => {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      error: "UNAUTHENTICATED",
    };
  }

  // Validate input data
  const validationResult = voteSubmissionSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
    };
  }

  const { startupId, voteType } = validationResult.data;

  try {
    // Check if startup exists
    const startup = await client
      .withConfig({ useCdn: false })
      .fetch(`*[_type == "startup" && _id == $startupId][0]`, {
        startupId,
      });

    if (!startup) {
      return {
        success: false,
        error: "STARTUP_NOT_FOUND",
      };
    }

    // Check if user already has a vote for this startup
    const existingVote = await client
      .withConfig({ useCdn: false })
      .fetch(USER_VOTE_QUERY, {
        userId: session.id,
        startupId,
      });

    if (existingVote) {
      // Update existing vote
      await writeClient
        .patch(existingVote._id)
        .set({ voteType })
        .commit();
    } else {
      // Create new vote
      await writeClient.create({
        _type: "vote",
        user: {
          _type: "reference",
          _ref: session.id,
        },
        startup: {
          _type: "reference",
          _ref: startupId,
        },
        voteType,
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return {
      success: false,
      error: "NETWORK_ERROR",
    };
  }
};

export const removeVote = async (data: VoteRemoval): Promise<VoteActionResult> => {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      error: "UNAUTHENTICATED",
    };
  }

  // Validate input data
  const validationResult = voteRemovalSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
    };
  }

  const { startupId } = validationResult.data;

  try {
    // Find the user's existing vote
    const existingVote = await client
      .withConfig({ useCdn: false })
      .fetch(USER_VOTE_QUERY, {
        userId: session.id,
        startupId,
      });

    if (!existingVote) {
      return {
        success: false,
        error: "STARTUP_NOT_FOUND",
      };
    }

    // Delete the vote
    await writeClient.delete(existingVote._id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error removing vote:", error);
    return {
      success: false,
      error: "NETWORK_ERROR",
    };
  }
};

export const getUserVote = async (data: GetUserVoteParams): Promise<VoteActionResult> => {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      error: "UNAUTHENTICATED",
    };
  }

  // Validate input data
  const validationResult = getUserVoteSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
    };
  }

  const { startupId, userId } = validationResult.data;

  // Ensure the user can only get their own vote
  if (userId !== session.id) {
    return {
      success: false,
      error: "UNAUTHENTICATED",
    };
  }

  try {
    const userVote = await client
      .withConfig({ useCdn: false })
      .fetch(USER_VOTE_QUERY, {
        userId: session.id,
        startupId,
      });

    return {
      success: true,
      data: userVote,
    };
  } catch (error) {
    console.error("Error getting user vote:", error);
    return {
      success: false,
      error: "NETWORK_ERROR",
    };
  }
};
