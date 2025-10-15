'use server'
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionClient } from "../appwrite"
import { parseStringify } from "../utils";
import { seedMockData } from "../server/seedMockData";



export const signIn = async ({email,password}: {email:string,password:string}) => {
    try {
        const { account } = await createAdminClient();

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

        return parseStringify(session)
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

  // Seed mock data for the new user
  await seedMockData({ userId: newUserAccount.$id });

  return parseStringify(newUserAccount);
    } catch (error) {
        console.error('Error',error)
        throw new Error('Failed to sign up. Please check your details and try again.');
    }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const user =await account.get();

    // Parse firstName and lastName from name
    const nameParts = user.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return parseStringify({ ...user, firstName, lastName })
  } catch (error) {
    return null;
  }
}

export const logoutAccount= async() => {
  try {
    const {account} = await createSessionClient();

    (await cookies()).delete('my-custom-session')

    await account.deleteSession('current')
  } catch (error) {
    return null
  }

}

export async function getBanks({ userId }: getBanksProps) {
  try {
    const { database } = await createSessionClient();

    const banks = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID!
    );

    const userBanks = banks.documents.filter((bank: any) => bank.userId === userId);

    return parseStringify(userBanks);
  } catch (error) {
    console.error('Error', error);
  }
}
