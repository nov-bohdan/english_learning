"use client";

import AuthForm from "@/components/Auth/AuthForm";
import { useState } from "react";

export default function Page() {
  const [formType, setFormType] = useState<"signup" | "signin">("signup");
  const changeFormType = (formType: "signup" | "signin") => {
    setFormType(formType);
  };

  if (formType === "signin") {
    return <AuthForm type="signin" changeFormType={changeFormType} />;
  } else if (formType === "signup") {
    return <AuthForm type="signup" changeFormType={changeFormType} />;
  }
}
