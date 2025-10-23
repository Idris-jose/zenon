"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { formSchema } from "../../../../lib/transfervalidation";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Building2, CreditCard, DollarSign } from "lucide-react";
import { getUserBankData, transferFunds } from "../../../../lib/actions/bank.actions";
import { getLoggedInUser } from "../../../../lib/actions/user.actions";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"





export default function TransferFundsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      amount: "",
    },
  })

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setMessage("");

    if (values.from === values.to) {
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
        fromAccountId: values.from,
        toAccountId: values.to,
        amount: parseFloat(values.amount),
        userId: loggedIn.$id,
      });

      setMessage(result.message);
      form.reset();

      // Refresh accounts to show updated balances
      const { accounts: updatedAccounts } = await getUserBankData(loggedIn.$id);
      setAccounts(updatedAccounts || []);
    } catch (error: any) {
      setMessage(error.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  const selectedFromAccount = accounts.find(acc => acc.$id === form.watch("from"));
  const selectedToAccount = accounts.find(acc => acc.$id === form.watch("to"));

  return (
    <div className="min-h-screen p-4 bg-white">
      {/* Header */}
    
       
          <div className="flex items-center gap-3 mt-3 mb-1">
            <h1 className="text-3xl font-bold">Transfer Funds</h1>
          </div>
          <p className="text-black">Move money securely between your accounts</p>
    
  
      {/* Main Content */}
      <div className="">
        <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* From Account Section */}
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      <Building2 className="w-4 h-4 text-orange-500" />
                      From Account
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-base">
                          <SelectValue placeholder="Select source account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {accounts.map((acc) => (
                          <SelectItem key={acc.$id} value={acc.$id}>
                            {acc.bankName} — {acc.accountNumber} (${acc.balance.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the account to transfer funds from.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedFromAccount && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedFromAccount.balance.toFixed(2)}</p>
                </div>
              )}

              {/* Transfer Direction Indicator */}
              <div className="flex justify-center">
                <div className="bg-orange-100 rounded-full p-3">
                  <ArrowLeftRight className="w-6 h-6 text-orange-600" />
                </div>
              </div>

              {/* To Account Section */}
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      To Account
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-base">
                          <SelectValue placeholder="Select destination account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.$id} value={acc.$id}>
                            {acc.bankName} — {acc.accountNumber} (${acc.balance.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the account to transfer funds to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedToAccount && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedToAccount.balance.toFixed(2)}</p>
                </div>
              )}

              {/* Amount Section */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      Transfer Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          className="pl-8 pr-4 py-6 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the amount to transfer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                  className="flex-1 py-6 text-base border-2 border-gray-300 hover:bg-gray-50 rounded-xl"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-6 text-base bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? "Processing..." : "Complete Transfer"}
                </Button>
              </div>
            </form>
          </Form>

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