import Image from "next/image";
import HeaderBox from "../../../components/HeaderBox";
import TotalBalanceBox from "../../../components/TotalBalanceBox";
import RightSidebar from "../../../components/RightSidebar";
import { getLoggedInUser } from "../../../lib/actions/user.actions";

export default async function Home() {
  const loggedIn = await getLoggedInUser();
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header text-3xl">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || "Guest"}
            subtext="Access and manage your account and transactions efficiently!"
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>

        RECENT TRANSACTIONS
      </div>
      <RightSidebar
      user={loggedIn as unknown as User}
      transactions={[]}
      banks={[{ currentBalance: 123.59, $id: '', accountId: '', bankId: '', accessToken: '', fundingSourceUrl: '', userId: '', sharableId: '' } as unknown as Bank & Account, { currentBalance: 123.59, $id: '', accountId: '', bankId: '', accessToken: '', fundingSourceUrl: '', userId: '', sharableId: '' } as unknown as Bank & Account]}
      />
    </section>
  );
}
