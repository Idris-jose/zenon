"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, Building2, CreditCard, DollarSign } from "lucide-react";
import { getUserBankData, transferFunds } from "../../../../lib/actions/bank.actions";
import { getLoggedInUser } from "../../../../lib/actions/user.actions";

export default function TransferFundsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [form, setForm] = useState({ from: "", to: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
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

    if (parseFloat(form.amount) <= 0) {
      setMessage("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    try {
      const loggedIn = await getLoggedInUser();
      if (!loggedIn) {
        setMessage("User not logged in.");
        setLoading(false);
        return;
      }

      const result = await transferFunds({
        fromAccountId: form.from,
        toAccountId: form.to,
        amount: parseFloat(form.amount),
        userId: loggedIn.$id,
      });

      setMessage(result.message);
      setForm({ from: "", to: "", amount: "" });

      // Refresh accounts to show updated balances
      const { accounts: updatedAccounts } = await getUserBankData(loggedIn.$id);
      setAccounts(updatedAccounts || []);
    } catch (error: any) {
      setMessage(error.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  const selectedFromAccount = accounts.find(acc => acc.$id === form.from);
  const selectedToAccount = accounts.find(acc => acc.$id === form.to);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <ArrowLeftRight className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Transfer Funds</h1>
          </div>
          <p className="text-orange-100">Move money securely between your accounts</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* From Account Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <Building2 className="w-4 h-4 text-orange-500" />
                From Account
              </label>
              <select
                title="select source account"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-base"
                required
              >
                <option value="">Select source account</option>
                {accounts.map((acc) => (
                  <option key={acc.$id} value={acc.$id}>
                    {acc.bankName} — {acc.accountNumber} (${acc.balance.toFixed(2)})
                  </option>
                ))}
              </select>
              {selectedFromAccount && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedFromAccount.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Transfer Direction Indicator */}
            <div className="flex justify-center">
              <div className="bg-orange-100 rounded-full p-3">
                <ArrowLeftRight className="w-6 h-6 text-orange-600" />
              </div>
            </div>

            {/* To Account Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <CreditCard className="w-4 h-4 text-orange-500" />
                To Account
              </label>
              <select
                title="select destination account"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-base"
                required
              >
                <option value="">Select destination account</option>
                {accounts.map((acc) => (
                  <option key={acc.$id} value={acc.$id}>
                    {acc.bankName} — {acc.accountNumber} (${acc.balance.toFixed(2)})
                  </option>
                ))}
              </select>
              {selectedToAccount && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedToAccount.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Amount Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <DollarSign className="w-4 h-4 text-orange-500" />
                Transfer Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="pl-8 pr-4 py-6 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setForm({ from: "", to: "", amount: "" })}
                className="flex-1 py-6 text-base border-2 border-gray-300 hover:bg-gray-50 rounded-xl"
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-6 text-base bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? "Processing..." : "Complete Transfer"}
              </Button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-center font-medium ${
                message.includes("success")
                  ? "bg-green-50 text-green-700 border-2 border-green-200"
                  : "bg-red-50 text-red-700 border-2 border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">i</span>
            Transfer Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Transfers between your accounts are processed instantly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>No fees apply for internal transfers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Ensure sufficient funds are available in the source account</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}