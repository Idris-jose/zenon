import type { Metadata } from "next";
import { Bricolage_Grotesque, Poppins } from "next/font/google";
import "../globals.css";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "../../../lib/actions/user.actions";

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
  title: "Zenon Auth",
  description: "Sign in or sign up to Zenon",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const loggedIn = await getLoggedInUser();
  
    
    
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${bricolageGrotesque.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
