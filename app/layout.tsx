import { Providers } from "./providers";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
