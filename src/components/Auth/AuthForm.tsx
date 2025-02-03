"use client";

import { signInAction, signUpAction } from "@/lib/auth/actions";
import { useActionState } from "react";
import Error from "../Errors/Error";

export default function AuthForm({
  changeFormType,
  type,
}: {
  changeFormType: (formType: "signup" | "signin") => void;
  type: "signup" | "signin";
}) {
  const chosenAction = type === "signup" ? signUpAction : signInAction;
  const [state, action, isPending] = useActionState(chosenAction, undefined);
  return (
    <div className="px-10 py-40 bg-white rounded-lg shadow-lg w-1/2 flex flex-col items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <form
        className="bg-white rounded-lg shadow-lg shadow-slate-600 p-6 flex flex-col gap-4 items-center text-lg"
        action={action}
      >
        {state?.success === false && (
          <Error message={state.error || "Unknown error"} />
        )}
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded-lg shadow-lg outline-none p-2 border-2 border-slate-400"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="w-full rounded-lg shadow-lg outline-none p-2 border-2 border-slate-400"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <button
            type="submit"
            className="bg-blue-500 font-semibold text-white rounded-lg py-4 px-8 shadow-lg hover:bg-blue-600 hover:shadow-slate-400 transition-all disabled:bg-gray-500 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {type === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </div>
        {type === "signup" ? (
          <div className="">
            <p
              className="cursor-pointer underline"
              onClick={() => changeFormType("signin")}
            >
              Already have an account? Sign in now!
            </p>
          </div>
        ) : (
          <div className="">
            <p
              className="cursor-pointer underline"
              onClick={() => changeFormType("signup")}
            >
              Do not have an account? Sign up now!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
