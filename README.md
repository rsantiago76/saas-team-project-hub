# SaaS Team Project Hub (Amplify Gen 2)

Includes:
- Auth (email + password) via Amplify Authenticator
- Username display: `UserProfile.displayName`
- Workspaces: create + auto OWNER membership
- Invites: create invite (copy link) + accept flow
- Projects → Tasks → Comments: basic UI

Build stability:
- `amplify_outputs.json` is committed as `{}` so the Next build passes before an Amplify backend env is attached.
- Once you create/attach the Amplify backend, Amplify will generate real outputs and Data will work.
