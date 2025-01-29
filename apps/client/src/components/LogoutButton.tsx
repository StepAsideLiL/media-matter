"use client";

import { logoutAction } from "@/libs/actions/logout";

export default function LogoutButton() {
  async function handleLogout() {
    await logoutAction();
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
