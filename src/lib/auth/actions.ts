"use server";

import { redirect } from "next/navigation";
import { ServerActionResponse } from "../practiceWords/types";
import { signIn, signUp } from "./auth";

export async function signUpAction(
  prevData: unknown,
  formData: FormData
): Promise<ServerActionResponse<string>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Invalid email or password" };
  }
  try {
    await signUp(email, password);
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "Unknown error" };
    }
  }
  redirect("/words");
}

export async function signInAction(prevData: unknown, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Invalid email or password" };
  }

  try {
    await signIn(email, password);
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "Unknown error" };
    }
  }

  redirect("/words");
}
