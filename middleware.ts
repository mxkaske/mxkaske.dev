import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.nextUrl.host;

  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/craft") && !host.includes("craft")) {
    const newPathname = pathname.replace("/craft", "");
    return NextResponse.redirect(
      new URL(newPathname, "https://craft.mxkaske.dev")
    );
  }

  if (pathname.startsWith("/brew") && !host.includes("brew")) {
    const newPathname = pathname.replace("/brew", "");
    return NextResponse.redirect(
      new URL(newPathname, "https://brew.mxkaske.dev")
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - assets (public assets)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|assets|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
