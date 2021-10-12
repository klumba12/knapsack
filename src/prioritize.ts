import currency from 'currency.js';
import { getLatency, Transaction } from './api';

export function prioritize(transactions: Transaction[], totalTime: number): Transaction[] {
  const n = transactions.length + 1;
  const capacity = totalTime + 1;

  const dp: currency[][] = [];
  for (let i = 0; i < n; i++) {
    dp[i] = new Array(capacity).fill(currency(0));
  }

  // dp[k][w] holds the max value of knapsack
  for (let k = 1; k < n; k++) {
    for (let w = 1; w < capacity; w++) {
      const tn = transactions[k - 1];
      const latency = getLatency(tn);
      
      let withK = currency(0);
      if (latency <= w) {
        withK = tn.amount.add(dp[k - 1][w - latency]);
      }

      const withoutK = dp[k - 1][w];
      dp[k][w] = withK.value > withoutK.value ? withK : withoutK;
    }
  }

  // returns the indices of the items of the optimal knapsack
  function knapsack(k: number, w: number): Set<number> {
    if (k === 0) {
      return new Set();
    }

    if (dp[k][w].value > dp[k - 1][w].value) {
      const index = k - 1;
      const tn = transactions[index];
      const latency = getLatency(tn);
      return new Set([index, ...knapsack(k - 1, w - latency)]);
    }

    return knapsack(k - 1, w);
  }

  // dp[n - 1][totalTime] contains the max amount

  return Array
    .from(knapsack(n - 1, totalTime))
    .map(i => transactions[i]);
}