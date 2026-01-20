import { defineAuth } from "@aws-amplify/backend";

/**
 * Auth (Cognito User Pool)
 * Email + password login
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
