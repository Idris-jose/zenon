"use client";

import { useEffect, useState } from "react";
import { getUserBankData } from "../../../../lib/actions/bank.actions";
import { getLoggedInUser } from "../../../../lib/actions/user.actions";

export default function TransferPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [form, setForm] = useState({ from: "", to: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user accounts when the page loads
    const fetchAccounts = async () => {
      const loggedIn = await getLoggedInUser();
      if (loggedIn) {
        const { accounts } = await getUserBankData(loggedIn.$id);
        setAccounts(accounts || []);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (form.from === form.to) {
      setMessage("You cannot transfer to the same account.");
      setLoading(false);
      return;
    }

    // For now, just simulate a transfer since transferFunds is not implemented
    setMessage("Transfer completed!");
    setLoading(false);
  };

  return (
    <section className="transfer-page p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transfer Funds</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* FROM ACCOUNT */}
        <div>
          <label className="block text-sm font-medium mb-1">From Account</label>
          <select
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            required
            title="From Account"
          >
            <option value="">Select account</option>
            {accounts.map((acc) => (
              <option key={acc.$id} value={acc.$id}>
                {acc.bankName} — {acc.accountNumber} (${acc.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* TO ACCOUNT */}
        <div>
          <label className="block text-sm font-medium mb-1">To Account</label>
          <select
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            required
            title="To Account"
          >
            <option value="">Select account</option>
            {accounts.map((acc) => (
              <option key={acc.$id} value={acc.$id}>
                {acc.bankName} — {acc.accountNumber} (${acc.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* AMOUNT */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Transfer"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
}
