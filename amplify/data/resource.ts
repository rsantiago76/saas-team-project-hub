import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Workspace: a.model({
    name: a.string().required(),
    slug: a.string().required(),
    ownerSub: a.string().required(),
  }).authorization((allow) => [allow.authenticated().to(["create","read","update","delete"])]),
});

export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: "userPool" },
});
