import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  UserProfile: a.model({
    userSub: a.string().required(),
    email: a.string().required(),
    displayName: a.string().required()
  }).secondaryIndexes((idx) => [idx("userSub")]),

  Workspace: a.model({
    name: a.string().required(),
    slug: a.string().required(),
    ownerSub: a.string().required()
  }).secondaryIndexes((idx) => [idx("slug")]),

  Membership: a.model({
    workspaceId: a.id().required(),
    userSub: a.string().required(),
    email: a.string().required(),
    role: a.enum(["OWNER","ADMIN","MEMBER"]).required()
  }).secondaryIndexes((idx) => [
    idx("workspaceId"),
    idx("userSub"),
    idx("workspaceId").sortKeys(["userSub"])
  ]),

  Invite: a.model({
    workspaceId: a.id().required(),
    email: a.string().required(),
    role: a.enum(["ADMIN","MEMBER"]).required(),
    token: a.string().required(),
    invitedBySub: a.string().required(),
    acceptedAt: a.datetime(),
    expiresAt: a.datetime()
  }).secondaryIndexes((idx) => [idx("token"), idx("workspaceId"), idx("email")]),

  Project: a.model({
    workspaceId: a.id().required(),
    name: a.string().required(),
    description: a.string(),
    createdBySub: a.string().required()
  }).secondaryIndexes((idx) => [idx("workspaceId")]),

  Task: a.model({
    workspaceId: a.id().required(),
    projectId: a.id().required(),
    title: a.string().required(),
    status: a.enum(["TODO","IN_PROGRESS","DONE"]).required(),
    assignedToSub: a.string(),
    createdBySub: a.string().required()
  }).secondaryIndexes((idx) => [idx("projectId"), idx("workspaceId")]),

  Comment: a.model({
    workspaceId: a.id().required(),
    taskId: a.id().required(),
    body: a.string().required(),
    authorSub: a.string().required()
  }).secondaryIndexes((idx) => [idx("taskId")]),
});

export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: "userPool" },
});
