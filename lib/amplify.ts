"use client";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

export function configureAmplifyOnce() {
  try {
    if (outputs && Object.keys(outputs as any).length > 0) {
      Amplify.configure(outputs as any);
      return true;
    }
  } catch {}
  return false;
}
