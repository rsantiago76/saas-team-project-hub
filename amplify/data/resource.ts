import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  UserProfile: a
    .model({
      userSub: a.string().required(),
      email: a.string().required(),
      displayName: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx) => [idx("userSub")])
    .authorization((allow) => [
      allow.ownerDefinedIn("userSub").to(["create", "read", "update"]),
    ]),

  Workspace: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      ownerSub: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx) => [idx("slug")])
    .authorization((allow) => [
      allow.ownerDefinedIn("ownerSub").to(["create", "read", "update", "delete"]),
      allow.authenticated().to(["read"]),
    ]),

  Membership: a
    .model({
      workspaceId: a.id().required(),
      userSub: a.string().required(),
      email: a.string().required(),
      role: a.enum(["OWNER", "ADMIN", "MEMBER"]).required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx) => [
      idx("workspaceId"),
      idx("userSub"),
      idx("workspaceId").sortKeys(["userSub"]),
    ])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("userSub").to(["create", "read", "delete"]),
    ]),

  Invite: a
    .model({
      workspaceId: a.id().required(),
      email: a.string().required(),
      role: a.enum(["ADMIN", "MEMBER"]).required(),
      token: a.string().required(),
      invitedBySub: a.string().required(),
      acceptedAt: a.datetime(),
      expiresAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx) => [idx("workspaceId"), idx("token"), idx("email")])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("invitedBySub").to(["create", "read", "update", "delete"]),
    ]),

  Project: a
    .model({
      workspaceId: a.id().required(),
      name: a.string().required(),
      description: a.string(),
      createdBySub: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx) => [idx("workspaceId")])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("createdBySub").to(["create", "update", "delete"]),
    ]),

  Task: a
    .model({
      workspaceId: a.id().required(),
      projectId: a.id().required(),
      title: a.string().required(),
      status: a.enum(["TODO", "IN_PROGRESS", "DONE"]).required(),
      assignedToSub: a.string(),
      createdBySub: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx) => [idx("projectId"), idx("workspaceId")])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("createdBySub").to(["create", "update", "delete"]),
    ]),

  Comment: a
    .model({
      workspaceId: a.id().required(),
      taskId: a.id().required(),
      body: a.string().required(),
      authorSub: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx) => [idx("taskId")])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("authorSub").to(["create", "update", "delete"]),
    ]),
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
