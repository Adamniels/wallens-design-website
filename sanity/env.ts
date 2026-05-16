// Environment variables for Sanity.
//
// NEXT_PUBLIC_* vars are used by Next.js (data fetching on the website).
// SANITY_STUDIO_* vars are used by the standalone studio (npm run studio).
//
// Both sets must be present in .env.local — see .env.local.example.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET,
  "Missing env variable: add NEXT_PUBLIC_SANITY_DATASET and SANITY_STUDIO_DATASET to .env.local"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID,
  "Missing env variable: add NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_STUDIO_PROJECT_ID to .env.local"
);

function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}
