"use client";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export async function getMe() {
  const user = await getCurrentUser();
  const session = await fetchAuthSession();
  const claims:any = session.tokens?.idToken?.payload || {};
  return { sub: claims.sub || user.userId, email: claims.email || "" };
}
