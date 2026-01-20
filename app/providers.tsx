"use client";

import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { configureAmplifyOnce } from "@/lib/amplify";

// Placeholder outputs is committed as {} so builds pass before backend is attached.
import outputs from "../amplify_outputs.json";

configureAmplifyOnce();

export function Providers({ children }: { children: React.ReactNode }) {
  const hasAuth = Boolean((outputs as any)?.auth);

  // ✅ Don’t block the UI when backend isn’t attached yet
  if (!hasAuth) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Auth UserPool not configured</h2>
        <p>
          Your <code>amplify_outputs.json</code> is still <code>{`{}`}</code>.
        </p>
        <p>
          Fix: Amplify Console → <strong>Backend environments</strong> →{" "}
          <strong>Create backend environment</strong> → Deploy.
        </p>
        <hr style={{ margin: "16px 0" }} />
        {children}
      </div>
    );
  }

  return <Authenticator>{() => <>{children}</>}</Authenticator>;
}
