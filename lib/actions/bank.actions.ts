"use server";
import { ID } from "node-appwrite";
import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";

export async function getUserBankData(userId: string) {
  const { database } = await createAdminClient();

  const banks = await database.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID!
  );

  const userBanks = banks.documents.filter((bank: any) => bank.userId === userId);

  const transactions = await database.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID!
  );

  // ✅ Match using the correct field: accountId
  const userTransactions = transactions.documents.filter((transaction: any) =>
    userBanks.some((bank: any) => bank.$id === transaction.accountId)
  );

  return {
    accounts: userBanks,
    transactions: userTransactions,
  };
}

export async function addBankAccount({
  userId,
  bankName,
  accountNumber,
  currency
}: {
  userId: string;
  bankName: string;
  accountNumber: string;
  currency:string
}) {
  const { database } = await createAdminClient();

  const response = await database.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID!,
    ID.unique(),
    {
      userId,
      bankName,
      accountNumber,
      balance: 0,           
      currency, 
      createdAt: new Date().toISOString(),     
    }
  );

  return response;
}