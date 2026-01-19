import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Workspace: a.model({
    name: a.string().required(),
    slug: a.string().required(),
    ownerSub: a.string().required(),
    groupAdmin: a.string().required(),
    groupMember: a.string().required(),
  }).authorization((allow) => [
    allow.groupsDefinedIn("groupMember").to(["read"]),
    allow.groupsDefinedIn("groupAdmin").to(["create","read","update","delete"]),
  ]),

  Project: a.model({
    workspaceId: a.id().required(),
    name: a.string().required(),
    description: a.string(),
    groupAdmin: a.string().required(),
    groupMember: a.string().required(),
  }).authorization((allow) => [
    allow.groupsDefinedIn("groupMember").to(["read"]),
    allow.groupsDefinedIn("groupAdmin").to(["create","read","update","delete"]),
  ]),
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
