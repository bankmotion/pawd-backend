import { BlockChain } from "./config/config";
import { createNewTransferTxs } from "./services/TransactionService";
import { getWalletTxsByAlchemy } from "./utils/AlchemyApi";
import { fetchTokenPrice } from "./utils/CoinGeckoApi";
import { deleteRecreateTable, syncTable } from "./utils/db";

const startCrawler = async (address: string) => {
  try {
    await deleteRecreateTable();

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

// syncTable();

startCrawler("0x00a8ac72bd166067b629f6111ddfde7570ce482a");
// startCrawler("0xfd132f736c825308090cdffb0bc6f502b4a471ca");
