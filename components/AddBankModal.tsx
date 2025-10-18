'use client';

import React, { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addBankAccount } from "../lib/actions/bank.actions"; // 👈 import the server action
import { useRouter } from "next/navigation";

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // 👈 add this prop
}

export default function AddBankModal({ isOpen, onClose, userId }: AddBankModalProps) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [currency,setCurrency] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await addBankAccount({
          userId,
          bankName,
          accountNumber,
          currency
        });

        setBankName('');
        setAccountNumber('');
        onClose();
        router.refresh(); // refresh the page to show new bank data
      } catch (error) {
        console.error("Failed to add bank:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-black">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>Enter your bank details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Bank Name</label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. Access Bank"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Account Number</label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 0123456789"
              required
            />
          </div>

            <select
          title='currency'
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="NGN">NGN</option>
          <option value="USD">USD</option>
        </select>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
