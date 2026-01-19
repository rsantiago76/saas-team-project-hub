export const metadata = {
  title: "SaaS Team Project Hub",
  description: "Multi-tenant SaaS demo (Amplify Gen 2)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>{children}</body>
    </html>
  );
}
