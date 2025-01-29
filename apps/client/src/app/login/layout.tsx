import auth from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await auth.currentUser();

  if (!(currentUser.username === null)) redirect("/");

  return <>{children}</>;
}
