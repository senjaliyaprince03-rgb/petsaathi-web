import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server"; // Just using next-auth default behaviour

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth/login");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
