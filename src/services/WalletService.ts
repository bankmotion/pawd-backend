import { BlockChain } from "../config/config";
import { createNewTransferTxs } from "../services/TransactionService";
import { getWalletTxsByAlchemy } from "../utils/AlchemyApi";
import { fetchTokenPrice } from "../utils/CoinGeckoApi";
import { deleteRecreateTable } from "../utils/db";

export const startCrawler = async (address: string) => {
  try {
    // await deleteRecreateTable();

    const txs = await getWalletTxsByAlchemy(address);

    const tokenPrices: { [key: string]: number[][] } = {};
    const tokenSet = new Set<string>();

    for (const tx of txs) {
      tokenSet.add(tx.tokenData.address);
    }

    if (tokenSet) {
      for (const token of tokenSet) {
        if (token) {
          tokenPrices[token] = (
            await fetchTokenPrice(
              token,
              new Date().getTime() / 1000 - BlockChain.TxResultDuration,
              new Date().getTime() / 1000
            )
          ).prices;
          console.log(`succeed for ${token} price `);
        }
      }
    }

    console.log(txs.length);
    await createNewTransferTxs(txs, tokenPrices);

    console.log("Ended crawler");
  } catch (err) {
    console.log(`startCrawler Error: ${err}`.red);
  }
};
