"use server";

import auth from "@/libs/auth";
import { revalidatePath } from "next/cache";

export async function logoutAction() {
  await auth.logoutUser();

  revalidatePath("/");
}
