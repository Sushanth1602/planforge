import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlanForgeProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlanForge — Collaborative Productivity for Builders & Teams",
  description:
    "Plan together. Build together. Finish together. The modern collaborative planning platform for hackathons, learning journeys, college projects, and competitions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <PlanForgeProvider>{children}</PlanForgeProvider>
      </body>
    </html>
  );
}
