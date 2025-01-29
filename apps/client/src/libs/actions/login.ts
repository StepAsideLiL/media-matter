"use server";

import auth from "@/libs/auth";

export async function loginUser(username: string) {
  const res = await auth.loginUser(username);

  return res;
}
