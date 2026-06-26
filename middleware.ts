import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isOwner = pathname.startsWith("/owner");
  const isBusiness = pathname.startsWith("/business");
  if (!isOwner && !isBusiness) return NextResponse.next();

  // login pages are public
  if (pathname === "/owner/login" || pathname === "/business/login") {
    return NextResponse.next();
  }

  const session = await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
  const requiredRole = isOwner ? "OWNER" : "BUSINESS";

  if (!session || session.role !== requiredRole) {
    const url = req.nextUrl.clone();
    url.pathname = isOwner ? "/owner/login" : "/business/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/business/:path*"],
};
