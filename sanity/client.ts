import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

// Read-only client — used for all data fetching on the frontend
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Write client — server-side only (contact form API route)
// Requires SANITY_API_TOKEN in .env.local
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
