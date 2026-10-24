import { NextResponse, type NextRequest } from "next/server";
import { getScale } from "@/lib/scales";
import { getTemplate } from "@/lib/templates";

/**
 * Okända mallar/skattningar ska ge en riktig 404. Med Cache Components strömmas sidans skal
 * innan notFound() hinner köras, så kontrollen görs här innan sidan renderas.
 */
export function proxy(request: NextRequest) {
  const [, area, slug] = request.nextUrl.pathname.split("/");
  const known = area === "hemuppgifter" ? getTemplate(slug) : getScale(slug);
  if (known) return NextResponse.next();
  // En sökväg utan route renderar app/not-found.tsx med status 404.
  return NextResponse.rewrite(new URL("/finns-inte", request.url));
}

export const config = {
  matcher: ["/hemuppgifter/:slug", "/behandlare/:slug"],
};
