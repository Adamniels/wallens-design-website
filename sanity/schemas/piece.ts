import { defineField, defineType } from "sanity";

export const pieceSchema = defineType({
  name: "piece",
  title: "Piece",
  type: "document",
  // Icon shown in Sanity Studio sidebar
  icon: () => "🪵",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of this piece (e.g. 'Oak Dining Table No. 4')",
      validation: (Rule) => Rule.required().min(2).max(100),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier — auto-generated from the title.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Furniture", value: "furniture" },
          { title: "Custom Commission", value: "commission" },
          { title: "Storage", value: "storage" },
          { title: "Seating", value: "seating" },
          { title: "Tables", value: "tables" },
          { title: "Outdoor", value: "outdoor" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "status",
      title: "Availability Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Sold", value: "sold" },
          { title: "Commission Only", value: "commission" },
          { title: "Not for Sale", value: "display" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "price",
      title: "Price (SEK)",
      type: "number",
      description: "Leave empty if commission-only or not for sale.",
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "The main showcase image. Use a high-quality photo.",
      options: {
        hotspot: true, // Enables focal point selection
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Short description for accessibility and SEO.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "images",
      title: "Additional Images",
      type: "array",
      description: "Up to 8 supporting images shown in the detail gallery.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional — shown below the image in the gallery.",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),

    defineField({
      name: "title_en",
      title: "Title (English)",
      type: "string",
      description: "English title — leave empty to use the Swedish title.",
    }),

    defineField({
      name: "description",
      title: "Description (Swedish)",
      type: "array",
      description: "Rich text description of the piece — materials, process, story.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Large", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
    }),

    defineField({
      name: "description_en",
      title: "Description (English)",
      type: "array",
      description: "English description — leave empty to fall back to Swedish.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Large", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
    }),

    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      description: "List the wood species and other materials used.",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "object",
      fields: [
        defineField({
          name: "height",
          title: "Height (cm)",
          type: "number",
        }),
        defineField({
          name: "width",
          title: "Width (cm)",
          type: "number",
        }),
        defineField({
          name: "depth",
          title: "Depth (cm)",
          type: "number",
        }),
        defineField({
          name: "note",
          title: "Dimension Note",
          type: "string",
          description: "Optional clarification, e.g. 'Extended length: 220cm'",
        }),
      ],
    }),

    defineField({
      name: "year",
      title: "Year Made",
      type: "number",
      description: "The year this piece was completed.",
    }),

    defineField({
      name: "featured",
      title: "Feature on Homepage",
      type: "boolean",
      description: "Pin this piece to the featured section on the home page.",
      initialValue: false,
    }),

    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first in the portfolio. Leave empty to sort by date.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "heroImage",
      status: "status",
      category: "category",
    },
    prepare({ title, media, status, category }) {
      const statusEmoji =
        status === "available" ? "🟢" :
        status === "sold" ? "🔴" :
        status === "commission" ? "🟡" : "⚪";
      return {
        title,
        subtitle: `${statusEmoji} ${status} · ${category}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }, { field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Newest First",
      name: "newestFirst",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
