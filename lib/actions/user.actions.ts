'use server'
import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionClient } from "../appwrite"
import { parseStringify } from "../utils";

export const signIn = async ({email,password}: {email:string,password:string}) => {
    try {
        
    } catch (error) {
        console.error('Error',error)
    }  
}

export const signUp = async (userData:SignUpParams) => {
    const {email,password,firstName,lastName} = userData
    try {
        const { account } = await createAdminClient();

 const newUserAccount = await account.create(
    ID.unique(),
    email,
    password,
    `${firstName} ${lastName}`
  );
  
  const session = await account.createEmailPasswordSession({
    email,
    password
  });

  (await cookies()).set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return parseStringify(newUserAccount);
    } catch (error) {
        console.error('Error',error)
    }  
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    
    const user =await account.get();

    return parseStringify(user)
  } catch (error) {
    return null;
  }
}