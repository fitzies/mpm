import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  const isPolarRoute = request.nextUrl.pathname.startsWith("/polar");
  const isLoginRoute = request.nextUrl.pathname === "/login";
  const isBarrackDamageForm =
    request.nextUrl.pathname === "/barrack-damages/form";

  // Redirect to /login if user is not logged in and not on /login or /polar routes
  if (!session && !isLoginRoute && !isPolarRoute && !isBarrackDamageForm) {
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
