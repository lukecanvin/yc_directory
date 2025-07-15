"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { USER_VOTE_QUERY } from "@/sanity/lib/queries";

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

export const submitVote = async (startupId: string, voteType: 'up' | 'down') => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not authenticated",
    });
  }

  if (!startupId || !voteType) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Missing required parameters",
    });
  }

  if (voteType !== 'up' && voteType !== 'down') {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Invalid vote type",
    });
  }

  try {
    // Check if startup exists
    const startup = await client.fetch(`*[_type == "startup" && _id == $startupId][0]`, {
      startupId,
    });

    if (!startup) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Startup not found",
      });
    }

    // Check if user already has a vote for this startup
    const existingVote = await client.fetch(USER_VOTE_QUERY, {
      userId: session.id,
      startupId,
    });

    if (existingVote) {
      // Update existing vote
      const result = await writeClient
        .patch(existingVote._id)
        .set({ voteType })
        .commit();

      return parseServerActionResponse({
        ...result,
        status: "SUCCESS",
        error: "",
      });
    } else {
      // Create new vote
      const result = await writeClient.create({
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

      return parseServerActionResponse({
        ...result,
        status: "SUCCESS",
        error: "",
      });
    }
  } catch (error) {
    console.error("Error submitting vote:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const removeVote = async (startupId: string) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not authenticated",
    });
  }

  if (!startupId) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Missing startup ID",
    });
  }

  try {
    // Find the user's existing vote
    const existingVote = await client.fetch(USER_VOTE_QUERY, {
      userId: session.id,
      startupId,
    });

    if (!existingVote) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "No vote found to remove",
      });
    }

    // Delete the vote
    const result = await writeClient.delete(existingVote._id);

    return parseServerActionResponse({
      ...result,
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    console.error("Error removing vote:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};

export const getUserVote = async (startupId: string) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not authenticated",
    });
  }

  if (!startupId) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Missing startup ID",
    });
  }

  try {
    const userVote = await client.fetch(USER_VOTE_QUERY, {
      userId: session.id,
      startupId,
    });

    return parseServerActionResponse({
      vote: userVote,
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    console.error("Error getting user vote:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};
