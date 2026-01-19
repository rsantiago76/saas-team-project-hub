import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Workspace: a.model({
    name: a.string().required(),
    slug: a.string().required(),
    ownerSub: a.string().required(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }),
  Membership: a.model({
    workspaceId: a.id().required(),
    userSub: a.string().required(),
    email: a.string().required(),
    role: a.enum(["OWNER", "ADMIN", "MEMBER"]).required(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }),
});

export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: "userPool" },
});
