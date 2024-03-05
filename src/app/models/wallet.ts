import { User } from "./user";

export interface WalletData {
  balance: number;
  currency: string;
}
export interface Wallet {
  data: WalletData;
  owner: User;
}
export interface Transaction {
  id?: string;
  type: string;
  timestamp: any;
  isCredit: boolean;
  amount: number;
  currency: string;
  isCompleted: boolean;
  isPaid: boolean;
  paid?: number;
}
export interface TransactionData {
  id: string;
  data: Transaction;
}

export interface BankInfo {
  Bank_name: string;
  account_no: string;
  project_id: string;
  password: string;
  meta_tag: string;
  test: number;
}
