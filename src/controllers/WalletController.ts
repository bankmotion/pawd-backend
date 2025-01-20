import { Request, Response } from "express";
import { startCrawler } from "../services/WalletService";
import { getTxsByAddress } from "../services/TransactionService";
import { BlockChain } from "../config/config";
import { getProfitabilityFromTxs, getRelatedWallet } from "../utils/utils";

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
    console.log(profitability, "profitability");
    const relatedWallets = (await getRelatedWallet(address, txs)) || [];
    console.log(relatedWallets, "relatedWallets");

    const relatedWalletProfitabilities = await Promise.all(
      Array.from(relatedWallets).map(async (wallet: string) => {
        const relatedTxs = await getTxsByAddress(wallet); // Fetch transactions for related wallet
        return {
          address: wallet,
          profitability: {
            month: getProfitabilityFromTxs(
              relatedTxs || [], // Default to empty array if undefined
              BlockChain.MonthDuration,
              wallet
            ),
            week: getProfitabilityFromTxs(
              relatedTxs || [], // Same here
              BlockChain.WeekDuration,
              wallet
            ),
          },
        };
      })
    );

    console.log(
      "Profitabilities for related wallets:",
      relatedWalletProfitabilities
    );

    res.status(200).json({
      status: 200,
      data: {
        profitability,
        relatedWalletProfitabilities,
        // txs,
      },
    });
  } catch (err) {
    console.error(`WalletController~getDataForWallet() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get wallet info" });
  }
};
