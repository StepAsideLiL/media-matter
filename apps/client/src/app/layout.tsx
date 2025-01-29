import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import auth from "@/libs/auth";
import LogoutButton from "@/components/LogoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Media Matter Client App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await auth.currentUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-b-gray-600">
          <div className="max-w-3xl mx-auto py-5 flex items-center justify-between">
            <Link href={"/"} className="font-bold font-mono">
              Media Matter
            </Link>

            <nav className="flex items-center gap-5">
              {currentUser.username ? (
                <>
                  <Link href={"/"} className="underline hover:no-underline">
                    Home
                  </Link>
                  <Link
                    href={"/profiles"}
                    className="underline hover:no-underline"
                  >
                    Profiles
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <Link href={"/login"} className="underline hover:no-underline">
                  Login
                </Link>
              )}
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
