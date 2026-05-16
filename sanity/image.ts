import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Helper to generate Sanity image URLs.
 *
 * Usage:
 *   urlFor(image).width(800).url()
 *   urlFor(image).width(1200).height(800).fit("crop").url()
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
