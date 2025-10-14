import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "../globals.css";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "../../../lib/actions/user.actions";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
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
      <body className={`${archivo.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
