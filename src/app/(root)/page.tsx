import Image from "next/image";
import HeaderBox from "../../../components/HeaderBox";
import TotalBalanceBox from "../../../components/TotalBalanceBox";
import RightSidebar from "../../../components/RightSidebar";

export default function Home() {
  const loggedIn = { firstName: "Idris", lastName: "jose", email: "josejose31@gmail.com" };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header text-3xl">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
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
      user={loggedIn}
      transactions={[]}
      banks={[{ currentBalance: 123.59},{currentBalance: 123.59}]}
      />
    </section>
  );
}
