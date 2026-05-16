import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Prefixes that should never be rewritten
const BYPASS_PREFIXES = [
  "/en",        // already locale-prefixed
  "/sv",        // direct /sv access — we will redirect these to clean URLs
  "/_next",
  "/api",
  "/studio",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /sv/... to the canonical clean URL (no prefix)
  if (pathname.startsWith("/sv")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  // Let everything else through unchanged if it matches a bypass prefix
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Skip static files (anything with a dot in the last segment)
  const lastSegment = pathname.split("/").pop() ?? "";
  if (lastSegment.includes(".")) {
    return NextResponse.next();
  }

  // Default locale: rewrite / → /sv internally
  const url = request.nextUrl.clone();
  url.pathname = `/sv${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
