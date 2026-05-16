import { defineField, defineType } from "sanity";

export const inquirySchema = defineType({
  name: "inquiry",
  title: "Inquiries",
  type: "document",
  icon: () => "📬",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),

    defineField({
      name: "pieceTitle",
      title: "Piece of Interest",
      type: "string",
      description: "The piece title the person asked about, if any.",
    }),

    defineField({
      name: "message",
      title: "Message",
      type: "text",
    }),

    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    }),

    defineField({
      name: "read",
      title: "Marked as Read",
      type: "boolean",
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: "Newest First",
      name: "newest",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "pieceTitle",
      read: "read",
    },
    prepare({ title, subtitle, read }) {
      return {
        title: `${read ? "✓ " : "🔵 "}${title}`,
        subtitle: subtitle ? `Re: ${subtitle}` : "General inquiry",
      };
    },
  },
});
