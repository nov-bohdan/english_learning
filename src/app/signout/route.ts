import { signOut } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  await signOut();
  redirect("/login");
}
