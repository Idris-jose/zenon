// src/lib/server/seedMockData.ts
"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";

type SeedOptions = {
  userId: string;
  startingBalance?: number;
  currency?: string;
  accountsToCreate?: number;
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRecentDate(daysBack = 30) {
  const d = new Date();
  d.setDate(d.getDate() - randomBetween(0, daysBack));
  // keep ISO string for Appwrite datetime field
  return d.toISOString();
}

export async function seedMockData(options: SeedOptions) {
  const {
    userId,
    startingBalance = 1000,
    currency = "NGN",
    accountsToCreate = 1,
  } = options;

  const { database } = await createAdminClient();

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const accountsCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID!;
  const transactionsCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID!;
  const cardsCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID || ""; // optional

  console.log("Seeding with:", {
  databaseId,
  accountsCollectionId,
  transactionsCollectionId,
  cardsCollectionId,
});


  if (!databaseId || !accountsCollectionId || !transactionsCollectionId) {
    throw new Error(
      "Missing Appwrite env IDs. Set NEXT_PUBLIC_APPWRITE_DATABASE_ID, NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID, NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID"
    );
  }

  // Create X accounts
  const createdAccounts: Array<{ $id: string; balance: number }> = [];

  for (let a = 0; a < accountsToCreate; a++) {
    const initial = Number(
      (startingBalance * (1 + Math.random() * 0.6 - 0.3)).toFixed(2)
    ); // small random variance
    const accountDoc = await database.createDocument(
      databaseId,
      accountsCollectionId,
      ID.unique(),
      {
        userId,
        bankName:
          a === 0 ? "Mock National Bank" : `Mock Bank ${randomBetween(1, 99)}`,
        accountNumber: `${randomBetween(1000000000, 9999999999)}`,
        balance: initial,
        currency,
        createdAt: new Date().toISOString(),
      }
    );
    createdAccounts.push({ $id: accountDoc.$id, balance: initial });

    // Optional: create a card for the account if cardsCollectionId provided
   
  }

  // Create transactions for each account
  const sampleDescriptions = [
    "Salary",
    "Grocery Store",
    "Electricity Bill",
    "Uber",
    "Netflix",
    "Dining Out",
    "Mobile Recharge",
    "Coffee",
    "Transfer from Friend",
    "Gym Membership",
  ];

  for (const acc of createdAccounts) {
    // Create a random number (6-12) of transactions
    const txCount = randomBetween(6, 12);
    for (let i = 0; i < txCount; i++) {
      // Decide if credit or debit (30% credits e.g. salary/transfer)
      const isCredit = Math.random() < 0.3;
      // Amount ranges: credit larger (5000-150000), debit smaller (50-20000)
      const amount = isCredit
        ? randomBetween(5000, 150000)
        : randomBetween(50, 20000);

      const tx = {
        userId,
        accountId: acc.$id,
        amount: isCredit ? amount : -amount,
        type: isCredit ? "credit" : "debit",
        description:
          isCredit && Math.random() < 0.5
            ? "Salary"
            : sampleDescriptions[randomBetween(0, sampleDescriptions.length - 1)],
        date: makeRecentDate(30),
        createdAt: new Date().toISOString(),
      };

      await database.createDocument(
        databaseId,
        transactionsCollectionId,
        ID.unique(),
        tx
      );
    }
  }

  return { accounts: createdAccounts };
}
