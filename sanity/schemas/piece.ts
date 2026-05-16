import { defineField, defineType } from "sanity";

export const pieceSchema = defineType({
  name: "piece",
  title: "Piece",
  type: "document",
  icon: () => "💍",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of this piece (e.g. 'Rose Gold Ring No. 3' or 'Pearl Drop Earrings')",
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
          { title: "Rings", value: "rings" },
          { title: "Necklaces", value: "necklaces" },
          { title: "Earrings", value: "earrings" },
          { title: "Bracelets", value: "bracelets" },
          { title: "Brooches", value: "brooches" },
          { title: "Custom Order", value: "commission" },
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
          { title: "Custom Order Only", value: "commission" },
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
      description: "Leave empty if custom-order only or not for sale.",
    }),

    defineField({
      name: "stockQuantity",
      title: "Stock Quantity",
      type: "number",
      description:
        "How many of this piece are available. Decremented automatically after each purchase. Set to 0 to mark as sold out without changing the status. Leave as 1 for unique one-of-a-kind pieces.",
      initialValue: 1,
    }),

    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description:
        "The Stripe Price ID for this piece (e.g. price_1Abc…). Filled in during Phase 3 Stripe setup — leave empty for now.",
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "The main showcase image. Use a high-quality product photo on a clean background.",
      options: {
        hotspot: true,
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
      description: "Up to 8 supporting images shown in the detail gallery. Show different angles, details, and worn shots.",
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
      description: "Rich text description — materials, gemstones, inspiration, and the story behind this piece.",
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
      description: "Metals and other materials used — e.g. '18k Rose Gold', 'Sterling Silver', 'Oxidised Brass'.",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "gemstones",
      title: "Gemstones",
      type: "array",
      description: "Stones set in the piece — e.g. 'White Diamond 0.3ct', 'Freshwater Pearl', 'Sapphire'.",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "object",
      description: "Measurements in millimetres. Use what is relevant for this type of piece.",
      fields: [
        defineField({
          name: "height",
          title: "Height / Length (mm)",
          type: "number",
          description: "Height of pendant, length of chain or bracelet.",
        }),
        defineField({
          name: "width",
          title: "Width (mm)",
          type: "number",
          description: "Width of ring band, pendant, or brooch.",
        }),
        defineField({
          name: "depth",
          title: "Thickness (mm)",
          type: "number",
          description: "Depth or thickness of the piece.",
        }),
        defineField({
          name: "note",
          title: "Dimension Note",
          type: "string",
          description: "Optional clarification — e.g. 'Ring size 17 (EU 54)', 'Chain length adjustable 40–45 cm'",
        }),
      ],
    }),

    defineField({
      name: "weightGrams",
      title: "Weight (grams)",
      type: "number",
      description: "Total weight of the piece in grams. Optional.",
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
      description: "Lower numbers appear first in the collection. Leave empty to sort by date.",
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
