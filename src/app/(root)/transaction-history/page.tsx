"use client";
import AddBankModal from "../../../../components/AddBankModal";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, PlusCircle, Check, Settings, Calendar, Search } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, getTransactionStatus } from "../../../../lib/utils";
import { Input } from "@/components/ui/input";
import { cn } from "../../../../lib/utils"

export default function TransactionHistory() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedIn = await getLoggedInUser();
        if (!loggedIn) return;

        const userData = loggedIn as unknown as User;
        setUser(userData);

        const { accounts: userAccounts, transactions: userTransactions } = await getUserBankData(userData.$id);
        setAccounts(userAccounts);
        setAllTransactions(userTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAccount, searchTerm, statusFilter, categoryFilter]);

  // Calculate total balance from all accounts
  const totalBalance = accounts.reduce((sum: number, account: any) => sum + account.balance, 0);

  // Filter and paginate transactions
  const filteredTransactions = allTransactions.filter((tx: any) => {
    const matchesAccount = selectedAccount === "all" || tx.accountId === selectedAccount;
    const matchesSearch = tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) || tx.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || getTransactionStatus(new Date(tx.date)) === statusFilter;
    const matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;

    return matchesAccount && matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Map transactions to display format
  const displayTransactions = paginatedTransactions.map((tx: any) => {
    const status = getTransactionStatus(new Date(tx.date));
    const formattedDate = formatDateTime(new Date(tx.date));

    return {
      id: tx.$id,
      icon: "/icons/transaction.svg", 
      desc: tx.description || "Transaction",
      amt: tx.amount,
      status,
      statusVariant: (status === "Processing" ? "secondary" : status === "Success" ? "default" : "destructive") as "secondary" | "default" | "destructive",
      date: formattedDate.dateTime,
      category: tx.category || "Other",
      categoryVariant: "default" as const,
    };
  });

  // Get selected account for display
  const selectedAccountData = selectedAccount === "all" ? null : accounts.find(account => account.$id === selectedAccount);
  const accountNumber = selectedAccountData ? `••••••••${selectedAccountData.accountNumber.slice(-4)}` : "••••••••9999";
  const accountName = selectedAccount === "all"
    ? "All Accounts"
    : selectedAccountData
    ? `${selectedAccountData.bankName} Account`
    : "Chase Growth Savings Account";
  const displayBalance = selectedAccount === "all"
    ? totalBalance
    : selectedAccountData
    ? selectedAccountData.balance
    : totalBalance;

    const [open, setOpen] = useState(false);

  return (
    <section className="container mx-auto overflow-y-scroll py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <AddBankModal isOpen={open} onClose={() => setOpen(false)} userId={user?.$id ?? ""} />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Transaction history over time</h1>
          <p className="text-sm text-gray-600">Gain insights and track your transactions over time</p>
        </div>
   <Select value={selectedAccount} onValueChange={setSelectedAccount}>
  <SelectTrigger className="w-[280px] border-gray-200 rounded-xl shadow-sm">
    <SelectValue>
      {(() => {
        const selected = accounts.find((a: any) => a.$id === selectedAccount);
        return selected ? selected.bankName : "Select Account";
      })()}
    </SelectValue>
  </SelectTrigger>

  <SelectContent className="bg-white rounded-xl shadow-lg p-2">
    {accounts.map((account: any) => (
      <SelectItem
        key={account.$id}
        value={account.$id}
        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 focus:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
              account.color || "bg-blue-500"
            }`}
          >
            {account.bankName
              .split(" ")
              .slice(0, 2)
              .map((word: string) => word[0])
              .join("")
              .toUpperCase()}
          </div>

          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{account.bankName}</span>
            <span className="text-sm text-blue-600">
              ${account.balance?.toLocaleString()}
            </span>
          </div>
        </div>

       
      </SelectItem>
    ))}

    <div className="border-t my-1" />
    
     <Button onClick={() => setOpen(true)}>
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add new bank
  
      </Button>
  </SelectContent>
</Select>

      </div>

      {/* Account Card */}
      <Card className=" bg-[#039855] text-white mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl text-white font-semibold">{accountName}</h2>
              <p className="text-blue-200 text-sm mt-1">{accountNumber}</p>
            </div>

          <div className="text-right p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <p className="text-white text-sm">Current balance</p>
          <p className="text-3xl font-bold text-white">${displayBalance.toLocaleString()}</p>
        </div>

          </div>
        </CardContent>
      </Card>

      <Separator /> {/* Optional divider */}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Transaction history</h2>
        <div className="text-sm text-gray-600">
          {filteredTransactions.length} transactions
        </div>
      </div>

<ScrollArea className="h-[500px] p-4  border border-gray-100 bg-white">
  <Table className="w-full text-sm">
    <TableHeader>
      <TableRow className="bg-gray-50 border-b">
        <TableHead className="text-gray-700 font-semibold">Transaction</TableHead>
        <TableHead className="text-right text-gray-700 font-semibold">Amount</TableHead>
        <TableHead className="text-gray-700 font-semibold">Status</TableHead>
        <TableHead className="text-gray-700 font-semibold">Date</TableHead>
        <TableHead className="text-gray-700 font-semibold">Category</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {displayTransactions.map((tx, index) => (
        <TableRow
          key={tx.id}
          className={`transition-colors ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50/70"
          } hover:bg-orange-50/50`}
        >
          {/* Transaction */}
          <TableCell className="py-4">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{tx.desc}</span>
            </div>
          </TableCell>

          {/* Amount */}
          <TableCell className="text-right font-semibold">
            <span
              className={
                tx.amt < 0 ? "text-red-500" : "text-emerald-600"
              }
            >
              {tx.amt < 0 ? "-" : "+"}${Math.abs(tx.amt).toFixed(2)}
            </span>
          </TableCell>

          {/* Status */}
          <TableCell>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                tx.status === "Success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : tx.status === "Processing"
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {tx.status}
            </span>
          </TableCell>

          {/* Date */}
          <TableCell className="text-gray-600">{tx.date}</TableCell>

          {/* Category */}
          <TableCell>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                tx.category === "Subscriptions"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : tx.category === "Deposit"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : tx.category === "Food and dining"
                  ? "bg-pink-50 text-pink-700 border border-pink-200"
                  : "bg-gray-50 text-gray-700 border border-gray-200"
              }`}
            >
              {tx.category}
            </span>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</ScrollArea>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

      </div>

      {/* Fallback */}
      {(!allTransactions || allTransactions.length === 0) && (
        <div className="flex flex-col items-center justify-center h-60 text-center mt-8">
          <p className="text-gray-500 text-lg font-medium">No transactions found.</p>
          <p className="text-gray-400 text-sm mt-1">Your transaction history will appear here once you start using your account.</p>
        </div>
      )}
    </section>
  );
}