"use client";
import { generateClient } from "aws-amplify/data";
// @ts-ignore generated after backend deploy
import type { Schema } from "@/amplify/data/resource";
export const client = generateClient<Schema>();
