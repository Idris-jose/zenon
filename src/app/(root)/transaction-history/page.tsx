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
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function TransactionHistory() {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="flex items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-semibold text-gray-500">
          Please sign in to view your transaction history.
        </h2>
      </section>
    );
  }

  const user = loggedIn as unknown as User;
  const { transactions } = await getUserBankData(user.$id);

  return (
    <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Review your recent account activities
          </p>
        </CardHeader>

        <CardContent>
          {transactions?.length > 0 ? (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableCaption>A summary of your latest transactions.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx: any) => (
                    <TableRow key={tx.$id}>
                      <TableCell className="text-gray-600">
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.amount < 0
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {tx.amount < 0 ? "Debit" : "Credit"}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          tx.amount < 0 ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {tx.amount < 0 ? "-" : "+"}₦{Math.abs(tx.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <p className="text-gray-500 text-lg font-medium">
                No transactions found.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Your transaction history will appear here once you start using your account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
