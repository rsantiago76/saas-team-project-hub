
export const metadata = {
  title: "SaaS Team Project Hub",
  description: "Multi-tenant SaaS on AWS Amplify Gen 2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
