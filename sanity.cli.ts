import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
  studioHost: "sm-struktur",
  deployment: {
    appId: "yeji0zhqucqe1fct51bm1nzo",
  },
});
