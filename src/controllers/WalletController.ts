import { Request, Response } from "express";
import { startCrawler } from "../services/WalletService";
import { getTxsByAddress } from "../services/TransactionService";
import { BlockChain } from "../config/config";
import { getProfitabilityFromTxs } from "../utils/utils";

export const getDataForWallet = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    await startCrawler(address);
    const txs = (await getTxsByAddress(address)) || [];
    console.log(txs);

    const profitability = {
      month: getProfitabilityFromTxs(txs, BlockChain.MonthDuration, address),
      week: getProfitabilityFromTxs(txs, BlockChain.WeekDuration, address),
    };
    res.status(200).json({
      status: 200,
      data: {
        profitability,
        txs,
      },
    });
  } catch (err) {
    console.error(`WalletController~getDataForWallet() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get wallet info" });
  }
};
