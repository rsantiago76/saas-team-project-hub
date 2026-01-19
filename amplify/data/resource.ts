import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Workspace: a.model({
    name: a.string().required(),
    slug: a.string().required(),
  }).authorization((allow) => [allow.authenticated()]),
});

export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: "userPool" },
});
