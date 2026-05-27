import AppShell from "@/components/app-shell";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return <AppShell user={session.user}>{children}</AppShell>;
}
