export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/categories/:path*", "/notes/:path*"]
};
