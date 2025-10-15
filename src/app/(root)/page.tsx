import Image from "next/image";
import HeaderBox from "../../../components/HeaderBox";
import TotalBalanceBox from "../../../components/TotalBalanceBox";
import RightSidebar from "../../../components/RightSidebar";
import { getLoggedInUser } from "../../../lib/actions/user.actions";
import { getUserBankData } from "../../../lib/actions/bank.actions";
import TransactionHistory from "./transaction-history/page";

export default async function Home() {
  const loggedIn = await getLoggedInUser();

  // if not logged in, show fallback UI
  if (!loggedIn) {
    return (
      <section className="home flex items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-semibold text-gray-600">
          Please sign in to access your dashboard.
        </h2>
      </section>
    );
  }

  const user = loggedIn as unknown as User;

  // Fetch mock data from Appwrite
  const { accounts, transactions } = await getUserBankData(user.$id);

  // Calculate total balance
  const totalBalance = accounts.reduce(
    (sum: number, acc: any) => sum + acc.balance,
    0
  );

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header text-3xl">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={user.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently!"
          />

          <TotalBalanceBox
            accounts={accounts}
            totalBanks={accounts.length}
            totalCurrentBalance={totalBalance}
          />
        </header>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>

          {
            transactions && transactions.length > 0 ? (
              <TransactionHistory  />
            ) : (
              <p className="text-gray-500">No transactions yet.</p>
            )
          }
        </div>
      </div>

      <RightSidebar user={user} transactions={transactions} banks={accounts} />
    </section>
  );
}
