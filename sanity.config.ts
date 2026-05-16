import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

export default defineConfig({
  projectId,
  dataset,
  apiVersion,
  title: "SM Struktur — Admin",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Pieces")
              .id("piece")
              .child(
                S.documentTypeList("piece")
                  .title("All Pieces")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
            S.divider(),
            S.listItem()
              .title("About Page")
              .id("about")
              .child(
                S.document()
                  .schemaType("about")
                  .documentId("about-singleton")
              ),
            S.divider(),
            S.listItem()
              .title("Inquiries")
              .id("inquiry")
              .child(
                S.documentTypeList("inquiry")
                  .title("Contact Inquiries")
                  .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
});
