import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export default withAuth(async function middleware() {}, {
  isReturnToCurrentPage: true,
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|$).*)",
  ],
};