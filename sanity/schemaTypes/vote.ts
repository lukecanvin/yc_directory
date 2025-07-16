import { ThumbsUpIcon } from "lucide-react";
import { defineType, defineField } from "sanity";

export const vote = defineType({
  name: "vote",
  title: "Vote",
  type: "document",
  icon: ThumbsUpIcon,
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startup",
      title: "Startup",
      type: "reference",
      to: { type: "startup" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "voteType",
      title: "Vote Type",
      type: "string",
      options: {
        list: [
          { title: "Thumbs Up", value: "up" },
          { title: "Thumbs Down", value: "down" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  // Enforce uniqueness constraint: one vote per user per startup
  validation: (Rule) =>
    Rule.custom(async (doc: any, context) => {
      if (!doc?.user?._ref || !doc?.startup?._ref) {
        return true; // Let field validation handle missing references
      }

      const { getClient } = context;
      const client = getClient({ apiVersion: "2023-01-01" });

      // Check for existing votes by this user for this startup
      const existingVotes = await client.fetch(
        `*[_type == "vote" && user._ref == $userId && startup._ref == $startupId && _id != $currentId]`,
        {
          userId: doc.user._ref,
          startupId: doc.startup._ref,
          currentId: doc._id || "",
        }
      );

      if (existingVotes.length > 0) {
        return "A user can only vote once per startup. Update the existing vote instead.";
      }

      return true;
    }),
  preview: {
    select: {
      userName: "user.name",
      startupTitle: "startup.title",
      voteType: "voteType",
    },
    prepare(selection) {
      const { userName, startupTitle, voteType } = selection;
      const voteIcon = voteType === "up" ? "👍" : "👎";
      return {
        title: `${userName} voted ${voteIcon}`,
        subtitle: `on ${startupTitle}`,
      };
    },
  },
});