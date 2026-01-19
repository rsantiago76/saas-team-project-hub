"use client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import outputs from "@/amplify_outputs.json";

try {
  if (outputs && Object.keys(outputs as any).length > 0) {
    Amplify.configure(outputs as any);
  }
} catch {}

export function Providers({ children }: { children: React.ReactNode }) {
  return <Authenticator>{() => <>{children}</>}</Authenticator>;
}
