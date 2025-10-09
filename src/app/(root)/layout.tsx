import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "../globals.css";
import Sidebar from "../../../components/Sidebar";
import MobileNav from "../../../components/MobileNav";
import Image from "next/image";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zenon",
  description: "Banking made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = { firstname: 'idris', lastname: 'jose'}
  return (
    <html lang="en">
     <body className={`${archivo.variable} ${inter.variable} antialiased`}>
  <main className="flex h-screen w-full font-archivo">
    {/* Sidebar — visible only on desktop */}
    <div className="hidden md:block">
      <Sidebar user={loggedIn} />
    </div>

    {/* Main content */}
    <div className="flex size-full flex-col">
      {/* Top bar */}
      <div className="block md:hidden">
        <div className="root-layout flex items-center justify-between p-4">
        <Image
          src="/icons/logo.svg"
          width={30}
          height={30}
          alt="menu icon"
          className="md:hidden"
        />

        {/* Mobile nav — visible only on mobile */}
        <div className="">
          <MobileNav user={loggedIn} />
        </div>
      </div>
      </div>
      

      {/* Page content */}
      {children}
    </div>
  </main>
</body>

    </html>
  );
}
