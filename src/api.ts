import currency from 'currency.js';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';

const TRANSACTION_API = path.resolve(__dirname, '../data/transactions.csv');
const LATENCY_API = path.resolve(__dirname, '../data/api_latencies.json');

interface TransactionCsvRow {
  id: string;
  amount: string;
  bank_country_code: string;
}

type Latencies = { [key: string]: number };

export interface Transaction {
  id: string;
  amount: currency;
  bankCountryCode: string;
  bankName: string;
}

export function getTransactions(): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    const transactions: Transaction[] = [];
    
    fs.createReadStream(TRANSACTION_API)
      .pipe(csv.parse({ headers: true, }))
      .on('data', (row: TransactionCsvRow) => {
        transactions.push({
          id: row.id,
          bankCountryCode: row.bank_country_code,
          bankName: `${row.bank_country_code} unknown`,
          amount: currency(row.amount),
        });
      })
      .on('error', error => reject(error))
      .on('end', () => resolve(transactions));
  });
}


// for the simplicity let's keep getLatency as a synchronous function
const LATENCIES: Latencies = require(LATENCY_API);
export function getLatency(transaction: Transaction): number {
  const key = transaction.bankCountryCode;
  if (!LATENCIES.hasOwnProperty(key)) {
    throw Error(`can't find latency for the "${key}"`);
  }

  return LATENCIES[key];
}

