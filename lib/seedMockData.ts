import { ID, Databases } from "node-appwrite";
import { faker } from "@faker-js/faker";
import { createAdminClient } from "./appwrite"; // your Appwrite client

export async function seedMockData({ userId, startingBalance }: { userId: string; startingBalance?: number }) {
  const { database: db } = await createAdminClient();
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

  // Create mock banks
  const bankDocs = await Promise.all(
    Array.from({ length: 2 }).map(async () => {
      return await db.createDocument(databaseId, "banks", ID.unique(), {
        userId: userId,
        bankName: faker.company.name() + " Bank",
        accountNumber: faker.finance.accountNumber(),
        balance: parseFloat(faker.finance.amount({ min: 1000, max: 100000, dec: 2 })),
        currency: "NGN",
      });
    })
  );

  // Create mock transactions for each bank
  for (const bank of bankDocs) {
    for (let i = 0; i < 10; i++) {
      await db.createDocument(databaseId, "transactions", ID.unique(), {
        bank_id: bank.$id,
        amount: parseFloat(faker.finance.amount({ min: 500, max: 50000, dec: 2 })),
        type: faker.helpers.arrayElement(["credit", "debit"]),
        description: faker.commerce.productName(),
        date: faker.date.recent({ days: 30 }).toISOString(),
      });
    }

    // Create card for each bank
    await db.createDocument(databaseId, "cards", ID.unique(), {
      bank_id: bank.$id,
      cardHolder: faker.person.fullName(),
      cardNumber: `**** **** **** ${faker.finance.creditCardNumber().slice(-4)}`,
      expiry: `${faker.number.int({ min: 1, max: 12 })}/${faker.number.int({ min: 26, max: 30 })}`,
      cardType: faker.helpers.arrayElement(["Visa", "MasterCard"]),
    });
  }
}
