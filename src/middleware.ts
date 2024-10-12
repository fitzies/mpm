import type { NextRequest } from "next/server";
import { decrypt } from "./lib/utils";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Check if the path starts with '/polar'
  const isPolarRoute = request.nextUrl.pathname.startsWith("/polar");
  // Check if the path is '/login'
  const isLoginRoute = request.nextUrl.pathname === "/login";

  // Redirect to /login if user is not logged in and not on /login or /polar routes
  if (!session && !isLoginRoute && !isPolarRoute) {
    return Response.redirect(new URL("/login", request.url));
  }

  // Redirect to / if user is logged in and on /login
  if (session && isLoginRoute) {
    return Response.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
