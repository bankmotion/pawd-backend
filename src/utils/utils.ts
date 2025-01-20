import { TypeTransferTx } from "../interface/TransferTxInt";
import TransferTx from "../models/TransferTxModel";

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
};

export const getTokenPriceByPriceBunch = (
  prices: number[][],
  targetTimestamp: number
) => {
  if (!prices.length) return 0;

  let beforeTime = prices[0][0];
  let curTime = prices[0][0];

  for (const [timestamp, price] of prices) {
    curTime = Math.floor(timestamp / 1000);
    if (curTime > targetTimestamp) {
      break;
    }
    beforeTime = curTime;
  }
  const correctTime =
    Math.abs(beforeTime - targetTimestamp) > Math.abs(curTime - targetTimestamp)
      ? curTime
      : beforeTime;

  const price = prices.find(
    ([tempTime, tempPrice]) => Math.floor(tempTime / 1000) === correctTime
  )![1];

  return price;
};

export const getRelatedWallet = (targetAddr: string, txs: TypeTransferTx[]) => {
  const relatedWallets = new Set<string>();

  for (const tx of txs) {
    if (tx.from === targetAddr) {
      relatedWallets.add(tx.to);
    } else if (tx.to === targetAddr) {
      relatedWallets.add(tx.from);
    }
  }

  return relatedWallets;
};

export const getProfitabilityFromTxs = (
  txs: TypeTransferTx[],
  duration: number,
  address: string
) => {};
