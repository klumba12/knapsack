
import currency from 'currency.js';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { Transaction, TRANSACTION_API } from './api';
import { prioritize } from './prioritize';

interface TransactionCsvRow {
  id: string;
  amount: string;
  bank_country_code: string;
}

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
  .on('error', error => console.error(error))
  .on('end', () => {
    test(transactions, 1000);
    test(transactions, 50);
    test(transactions, 60);
    test(transactions, 90);

    process.exit();
  });

function test(transactions: Transaction[], totalTime: number) {
  const filtered = prioritize(transactions, totalTime);
  const amount = filtered.reduce((memo, x) => memo.add(x.amount), currency(0));
  console.log(`result for ${totalTime}ms is $${amount.toString()}`);
}
