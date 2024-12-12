import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
          )}
        >
          <div className="flex h-screen">
          <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 border-r">
            <Sidebar />
          </aside>
          <div className="md:pl-72 flex-1">
            <Header />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
        </body>
      </html>
    </ClerkProvider>
  );
}