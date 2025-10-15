import { getLoggedInUser } from "../../../../lib/actions/user.actions";
import { getUserBankData } from "../../../../lib/actions/bank.actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function transactionHistory() {
  const loggedIn = await getLoggedInUser();

  // if not logged in, show fallback UI
  if (!loggedIn) {
    return (
      <section className="transaction-history flex items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-semibold text-gray-600">
          Please sign in to view your transaction history.
        </h2>
      </section>
    );
  }

  const user = loggedIn as unknown as User;

  // Fetch transactions from Appwrite
  const { transactions } = await getUserBankData(user.$id);

  return (
    <section className="transaction-history">
      <div className="transaction-history-content">
        <header className="transaction-history-header">
          <h1 className="text-3xl font-bold mb-4">Transaction History</h1>
        </header>

        <div className="mt-6">
          {transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((tx: any) => (
                <li
                  key={tx.$id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`font-semibold text-lg ${
                      tx.amount < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No transactions yet.</p>
          )}
        </div>
      </div>
      <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
    </section>
  );
}
