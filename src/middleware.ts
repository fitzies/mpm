import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  const isPolarRoute = request.nextUrl.pathname.startsWith("/polar");
  const isLoginRoute = request.nextUrl.pathname === "/login";
  const isBarrackDamageForm =
    request.nextUrl.pathname === "/barrack-damages/form";
  const isBarrackDamageFormSubmitted =
    request.nextUrl.pathname === "/barrack-damages/submitted";
  const isHomePage = request.nextUrl.pathname === "/";

  // Redirect to /login if user is not logged in and not on /login or /polar routes
  if (
    !session &&
    !isPolarRoute &&
    !isBarrackDamageForm &&
    !isBarrackDamageFormSubmitted &&
    !isLoginRoute &&
    !isHomePage
  ) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (session && (isLoginRoute || isHomePage)) {
    return Response.redirect(new URL("/companies", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
