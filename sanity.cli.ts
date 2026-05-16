import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
  studioHost: "wallens-design",
  deployment: {
    appId: "cpjp47wuo65ja8fsg1vv9hq3",
  },
});
