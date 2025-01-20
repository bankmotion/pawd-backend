import { Addresses } from "../config/config";
import { TypeTransferTx } from "../interface/TransferTxInt";
import db from "../models";
import { getTokenPriceByPriceBunch } from "../utils/utils";
import { createTokenInfo, getTokenInfo } from "./TokenService";

export const createNewTransferTxs = async (
  txs: TypeTransferTx[],
  tokenPrices: { [key: string]: number[][] }
) => {
  try {
    for (const tx of txs) {
      const transferInfo = await getTransferTx(tx);
      if (!transferInfo) {
        let tokenInfo = await getTokenInfo(tx.tokenData.address);
        if (!tokenInfo) {
          tokenInfo = await createTokenInfo(tx.tokenData);
        }

        const price = getTokenPriceByPriceBunch(
          tokenPrices[
            !tx.tokenData.address ? Addresses.WETH : tx.tokenData.address
          ],
          tx.blockTimestamp
        );
        await db.TransferTx.create({
          ...tx,
          tokenId: tokenInfo?.id,
          price: price.toFixed(10),
        });
      }
    }
  } catch (err) {
    console.log(`TrasactionService createNewTransferTxs() ERROR ${err}`.red);
  }
};

export const getTransferTx = async (tx: TypeTransferTx) => {
  try {
    const data = await db.TransferTx.findOne({
      where: { hash: tx.hash, from: tx.from, to: tx.to },
    });

    return data;
  } catch (err) {
    console.log(`TrasactionService isTransferTx() ERROR ${err}`.red);
  }
};
