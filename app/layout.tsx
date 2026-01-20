import { Providers } from "./providers";

export const metadata = { title: "SaaS Team Project Hub" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
