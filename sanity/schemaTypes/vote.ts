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