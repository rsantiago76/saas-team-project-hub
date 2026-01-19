# SaaS Team Project Hub (Amplify)

Fixes Amplify compile error pointing at `app/providers.tsx` by:
- Including a placeholder `amplify_outputs.json`
- Importing it with a RELATIVE path (no @/* alias required)

Next step after green:
- Attach Amplify Gen 2 backend (Auth + Data)
- Replace placeholder outputs with generated outputs
