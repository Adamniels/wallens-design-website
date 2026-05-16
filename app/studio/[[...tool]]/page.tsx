import { redirect } from "next/navigation";

// The Sanity Studio is hosted separately via `npx sanity deploy`.
// Nothing to see here — send visitors back to the homepage.
export default function StudioPage() {
  redirect("/");
}
