import type { Metadata } from "next";
import { Bricolage_Grotesque, Poppins } from "next/font/google";
import "../globals.css";
import Sidebar from "../../../components/Sidebar";
import MobileNav from "../../../components/MobileNav";
import Image from "next/image";
import { getLoggedInUser } from "../../../lib/actions/user.actions";
import { redirect } from "next/navigation";


const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Zenon",
  description: "Banking made easy",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const loggedIn = await getLoggedInUser();
   
  

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${bricolageGrotesque.variable} antialiased`}>
        <main className="flex h-screen w-full font-poppins">
          {/* Sidebar — visible only on desktop */}
          <div className="hidden md:block">
            <Sidebar user={loggedIn as unknown as User} />
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
                  alt="Zenon logo"
                  className="md:hidden"
                />
                {/* Mobile nav — visible only on mobile */}
                <MobileNav user={loggedIn as unknown as User} />
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
