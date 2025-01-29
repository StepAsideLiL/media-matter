"use client";

import { logoutAction } from "@/libs/actions/logout";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();

    router.push("/");
  }

  return (
    <button
      className="underline hover:no-underline"
      onClick={() => handleLogout()}
    >
      Logout
    </button>
  );
}
