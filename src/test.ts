import currency from 'currency.js';
import { getTransactions, Transaction } from './api';
import { prioritize } from './prioritize';

getTransactions()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .then(transactions => {
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
