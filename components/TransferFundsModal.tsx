"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserBankData, transferFunds } from "../lib/actions/bank.actions";
import { getLoggedInUser } from "../lib/actions/user.actions";

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferFundsModal({ isOpen, onClose }: TransferFundsModalProps) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [form, setForm] = useState({ from: "", to: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchAccounts = async () => {
      const loggedIn = await getLoggedInUser();
      if (loggedIn) {
        const { accounts } = await getUserBankData(loggedIn.$id);
        setAccounts(accounts || []);
      }
    };

    fetchAccounts();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (form.from === form.to) {
      setMessage("You cannot transfer to the same account.");
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

      setMessage(result.message || "Transfer completed successfully!");
      setForm({ from: "", to: "", amount: "" }); // Reset form on success
    } catch (error: any) {
      setMessage(error.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-black text-white">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Move money between your linked accounts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* FROM ACCOUNT */}
          <div>
            <label className="text-sm font-medium">From Account</label>
            <select
              title="select account"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              className="w-full border rounded-lg p-2 bg-black text-white focus:ring-2 focus:ring-blue-500"
              required
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
            <label className="text-sm font-medium">To Account</label>
            <select
              title="saccount to trasfer"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className="w-full border rounded-lg p-2 bg-black text-white focus:ring-2 focus:ring-blue-500"
              required
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
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Transfer"}
            </Button>
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("success")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
