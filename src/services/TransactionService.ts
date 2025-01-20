import { Op } from "sequelize";
import { Addresses, BlockChain } from "../config/config";
import { TypeTransferTx } from "../interface/TransferTxInt";
import db from "../models";
import { getTokenPriceByPriceBunch } from "../utils/utils";
import { createTokenInfo, getTokenInfo } from "./TokenService";
import TransferTx from "../models/TransferTxModel";
import Token from "../models/TokenModel";

TransferTx.belongsTo(Token, {
  foreignKey: "tokenId",
  as: "tokenData",
});

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

export const getTxsByAddress = async (address: string) => {
  try {
    const curTime = Math.floor(new Date().getTime() / 1000);
    const data = await db.TransferTx.findAll({
      where: {
        [Op.and]: [
          {
            blockTimestamp: {
              [Op.gte]: curTime - BlockChain.TxResultDuration,
            },
          },
          {
            [Op.or]: [{ from: address }, { to: address }],
          },
        ],
      },
      include: { model: Token, as: "tokenData" },
    });

    const result = data.map((tx) => tx.toJSON()) as TypeTransferTx[];
    return result;
  } catch (err) {
    console.log(`TransactionService~getTxsByAddress Error ${err}`.red);
  }
};
