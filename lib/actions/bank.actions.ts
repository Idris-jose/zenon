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
export async function transferFunds({
  fromAccountId,
  toAccountId,
  amount,
  userId,
}: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  userId: string;
}) {
  const { database } = await createAdminClient();

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const accountsCollection = process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID!;
  const transactionsCollection = process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID!;

  // Fetch both accounts
  const fromAccount = await database.getDocument(databaseId, accountsCollection, fromAccountId);
  const toAccount = await database.getDocument(databaseId, accountsCollection, toAccountId);

  // Ensure both accounts exist
  if (!fromAccount || !toAccount) {
    throw new Error("One or both accounts not found");
  }

  // Ensure both belong to same user
  if (fromAccount.userId !== userId || toAccount.userId !== userId) {
    throw new Error("Unauthorized transfer: account mismatch");
  }

  // Check balance
  if (fromAccount.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // Compute new balances
  const newFromBalance = fromAccount.balance - amount;
  const newToBalance = toAccount.balance + amount;

  // Update balances
  await database.updateDocument(databaseId, accountsCollection, fromAccountId, {
    balance: newFromBalance,
  });

  await database.updateDocument(databaseId, accountsCollection, toAccountId, {
    balance: newToBalance,
  });

  // Record transactions
  const transactionId1 = ID.unique();
  const transactionId2 = ID.unique();
  const timestamp = new Date().toISOString();

  await database.createDocument(databaseId, transactionsCollection, transactionId1, {
    userId,
    accountId: fromAccountId,
    type: "debit",
    amount: -amount,
    description: `Transfer to ${toAccount.bankName} - ${toAccount.accountNumber}`,
    date: timestamp,
    createdAt: timestamp, // ✅ FIX: added
  });

  await database.createDocument(databaseId, transactionsCollection, transactionId2, {
    userId,
    accountId: toAccountId,
    type: "credit",
    amount,
    description: `Transfer from ${fromAccount.bankName} - ${fromAccount.accountNumber}`,
    date: timestamp,
    createdAt: timestamp, // ✅ FIX: added
  });

  return { success: true, message: "Transfer completed successfully" };
}