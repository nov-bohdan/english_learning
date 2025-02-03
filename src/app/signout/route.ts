import { signOut } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  await signOut();
  redirect("/login");
}
