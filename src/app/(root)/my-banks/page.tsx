import { getLoggedInUser } from "../../../../lib/actions/user.actions";
import { getUserBankData } from "../../../../lib/actions/bank.actions";
import BankCard from "../../../../components/BankCard";
import HeaderBox from "../../../../components/HeaderBox";

export default async function page() {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="flex-center h-[80vh]">
        <h2 className="text-2xl text-gray-600">Please sign in to continue.</h2>
      </section>
    );
  }

  const user = loggedIn as unknown as User;
  const { accounts } = await getUserBankData(user.$id);

  return (
    <section className="bank-page p-6">
      <HeaderBox
        type="title"
        title="Your Bank Accounts"
        subtext="View details for each linked bank account."
      />

      {accounts.length > 0 ? (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {accounts.map((acc: any) => (
            <BankCard
        key={acc.$id.$id}
        userName={`${user?.firstName || "Guest"} ${user?.lastName || ""}`}
        bankName={acc.bankName}
        accountNumber={acc.accountNumber}
        account={acc}
        showBalance={true}
      />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-gray-500">No accounts found.</p>
      )}

     

      
                   
    </section>
  );
}
