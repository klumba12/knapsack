import currency from 'currency.js';
import * as path from 'path';

export const TRANSACTION_API =  path.resolve(__dirname, '../data/transactions.csv');

export interface Transaction {
  id: string;
  amount: currency;
  bankCountryCode: string;
  bankName: string;
}

type Latencies = { [key: string]: number };
const LATENCY_API = path.resolve(__dirname, '../data/api_latencies.json');
const LATENCIES: Latencies = require(LATENCY_API);

export function getLatency(transaction: Transaction): number {
  const key = transaction.bankCountryCode;
  if (!LATENCIES.hasOwnProperty(key)) {
    throw Error(`can't find latency for the "${key}"`);
  }

  return LATENCIES[key];
}
