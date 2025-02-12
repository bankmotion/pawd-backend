import {
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersWithMetadataResponse,
  AssetTransfersWithMetadataResult,
  Network,
  SortingOrder,
} from "alchemy-sdk";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import BN from "bn.js";
import { APIKey, BlockChain, Delay } from "../config/config";
import { delay } from "./utils";
import "colors";
import { TypeTransferTx } from "../interface/TransferTxInt";

const settings = {
  apiKey: APIKey.AlchemyAPIKey,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${APIKey.AlchemyAPIKey}`
);

// const fromWeiWithDecimals = (value: string) => {
//   const cleanValue = value.replace(/[^0-9.]/g, "");

//   // Convert to a BigNumber and handle decimals
//   const decimalPlaces = 18; // For Ether, 18 decimal places
//   const factor = new BN(10).pow(new BN(decimalPlaces)); // 10^18

//   // Multiply by factor to remove decimals before creating BN instance
//   const valueWithDecimals = new BN(
//     Math.round(parseFloat(cleanValue) * Math.pow(10, decimalPlaces))
//   );

//   // Now convert it back to Ether or token representation using Web3.js
//   const formattedValue = web3.utils.fromWei(
//     valueWithDecimals.toString(),
//     "ether"
//   );

//   return formattedValue;
// };

// export const fetchWalletTxs = async (wallet: string) => {
//   try {
//     const transfers = await alchemy.core.getAssetTransfers({
//       toAddress: wallet,
//       excludeZeroValue: true,
//       category: ["erc20", "external"] as AssetTransfersCategory[],
//       withMetadata: true,
//       order: "desc" as SortingOrder,
//     });

//     return transfers.transfers;
//   } catch (err) {
//     console.error(
//       `Error: fetching trasactions(alchemyApi.ts->fetchWalletTxs): ${err}`
//     );
//     return null;
//   }
// };

// export const fetchAllWalletTxs = async (wallet: string) => {
//   try {
//     const transfers_from = await alchemy.core.getAssetTransfers({
//       fromAddress: wallet,
//       excludeZeroValue: true,
//       category: ["erc20", "external"] as AssetTransfersCategory[],
//       withMetadata: true,
//       order: "desc" as SortingOrder,
//     });

//     const transfers_to = await alchemy.core.getAssetTransfers({
//       toAddress: wallet,
//       excludeZeroValue: true,
//       category: ["erc20", "external"] as AssetTransfersCategory[],
//       withMetadata: true,
//       order: "desc" as SortingOrder,
//     });

//     const combinedTransfers = [
//       ...(transfers_from.transfers || []),
//       ...(transfers_to.transfers || []),
//     ];

//     return combinedTransfers;
//   } catch (err) {
//     console.error(
//       `Error: fetching trasactions(alchemyApi.ts->fetchWalletTxs): ${err}`
//     );
//     return null;
//   }
// };

// // Helper function to fetch the token price
// export const fetchWalletEthBalance = async (wallet: string) => {
//   try {
//     const balanceWei = await web3.eth.getBalance(wallet);
//     const balanceEth = web3.utils.fromWei(balanceWei, "ether");
//     console.log(`ETH balance for ${wallet}: ${balanceEth} ETH`);
//     return balanceEth;
//   } catch (err) {
//     console.error(`Error: fetching Eth Balance: ${err}`);
//     return null;
//   }
// };

// export const fetchWalletBalance = async (
//   walletAddress: string
// ): Promise<{
//   nativeBalance: string;
//   tokenBalances: {
//     tokenAddress: string;
//     tokenSymbol: string;
//     balance: string;
//   }[];
// }> => {
//   try {
//     console.log("Fetching native balance for wallet address:", walletAddress);

//     // Step 1: Fetch native balance
//     const nativeBalanceInWei = await alchemy.core.getBalance(walletAddress);
//     console.log("Native balance (in Wei):", nativeBalanceInWei.toString());

//     const nativeBalance = Number(
//       web3.utils.fromWei(nativeBalanceInWei.toString(), "ether")
//     ).toFixed(4);
//     console.log("Native balance (in ETH):", nativeBalance);

//     // Step 2: Fetch token balances
//     console.log("Fetching token balances for wallet address:", walletAddress);
//     const tokenBalancesResponse = await alchemy.core.getTokenBalances(
//       walletAddress
//     );
//     console.log("Raw token balances response:", tokenBalancesResponse);

//     // Step 3: Process each token balance with error handling
//     const tokenBalances = await Promise.all(
//       tokenBalancesResponse.tokenBalances.map(async (token) => {
//         try {
//           console.log(
//             "Fetching metadata for token contract address:",
//             token.contractAddress
//           );
//           const metadata = await alchemy.core.getTokenMetadata(
//             token.contractAddress
//           );

//           const formattedBalance = (
//             Number(token.tokenBalance) /
//             10 ** (metadata.decimals || 18)
//           ).toFixed(4);
//           console.log("Formatted token balance:", formattedBalance);

//           return {
//             tokenAddress: token.contractAddress,
//             tokenSymbol: metadata.symbol || "UNKNOWN",
//             balance: formattedBalance,
//           };
//         } catch (error) {
//           console.warn(
//             `Skipping token due to error: ${token.contractAddress}`,
//             error
//           );
//           // Skip this token by returning null
//           return null;
//         }
//       })
//     );

//     // Step 4: Filter out null values and tokens with balance <= 0
//     console.log("Filtering token balances...");
//     const filteredTokenBalances = tokenBalances.filter(
//       (token) => token !== null && Number(token!.balance) > 0
//     ) as {
//       tokenAddress: string;
//       tokenSymbol: string;
//       balance: string;
//     }[];
//     console.log("Filtered token balances:", filteredTokenBalances);

//     // Step 5: Return the result
//     console.log("Final result - Native Balance and Token Balances:");
//     console.log({ nativeBalance, tokenBalances: filteredTokenBalances });

//     return {
//       nativeBalance,
//       tokenBalances: filteredTokenBalances,
//     };
//   } catch (error) {
//     console.error("Error fetching wallet balance:", error);
//     throw new Error("Failed to fetch wallet balance.");
//   }
// };

// // export const getRelatedWallets = async (seedWallet: string): Promise<string[]> => {
// //     try {
// //         const outgoingTxs = await alchemy.core.getAssetTransfers({
// //             fromAddress: seedWallet,
// //             excludeZeroValue: true,
// //             category: ["erc20", "external"] as AssetTransfersCategory[],
// //             withMetadata: true,
// //             order: "desc" as SortingOrder,
// //         });

// //         const incomingTxs  = await alchemy.core.getAssetTransfers({
// //             toAddress: seedWallet,
// //             excludeZeroValue: true,
// //             category: ["erc20", "external"] as AssetTransfersCategory[],
// //             withMetadata: true,
// //             order: "desc" as SortingOrder,
// //         });

// //         const relatedWallets = new Set<string>();

// //         outgoingTxs.transfers.forEach((tx) => {
// //             if (tx.to && tx.to.toLowerCase() !== seedWallet.toLowerCase()) {
// //               relatedWallets.add(tx.to); // Add recipient wallets
// //             }
// //           });

// //           incomingTxs.transfers.forEach((tx) => {
// //             if (tx.from && tx.from.toLowerCase() !== seedWallet.toLowerCase()) {
// //               relatedWallets.add(tx.from); // Add sender wallets
// //             }
// //           });

// //           return Array.from(relatedWallets);
// //     } catch (err) {
// //         console.error(
// //             `Error: fetching trasactions(alchemyApi.ts->fetchWalletTxs): ${err}`
// //         );
// //         return [];
// //     }
// // };

// export const getRelatedWallets = async (
//   seedWallet: string
// ): Promise<{ address: string; txs: AssetTransfersWithMetadataResult[] }[]> => {
//   try {
//     console.log(
//       `Fetching outgoing transactions for seed wallet: ${seedWallet}`
//     );

//     let outgoingTxs: AssetTransfersWithMetadataResponse | null = null;
//     let retries = 0;

//     while (!outgoingTxs && retries < Delay.MaxRetries) {
//       try {
//         outgoingTxs = await alchemy.core.getAssetTransfers({
//           fromAddress: seedWallet,
//           excludeZeroValue: true,
//           category: ["erc20", "external"] as AssetTransfersCategory[],
//           withMetadata: true,
//           order: "desc" as SortingOrder,
//           maxCount: BlockChain.MaxTXCount,
//         });
//       } catch (err) {
//         retries++;
//         console.log(`Retrying call api after few sec`.red);
//         await delay(Delay.AlchemyAPI);
//       }
//     }

//     if (!outgoingTxs) {
//       throw new Error(`Failed to fetch tokens transfers`.red);
//     }

//     console.log(
//       `Outgoing transactions fetched (${outgoingTxs.transfers.length}):`
//     );

//     console.log(
//       `Fetching incoming transactions for seed wallet: ${seedWallet}`
//     );

//     retries = 0;
//     let incomingTxs: AssetTransfersWithMetadataResponse | null = null;

//     while (!incomingTxs && retries < Delay.MaxRetries) {
//       try {
//         incomingTxs = await alchemy.core.getAssetTransfers({
//           toAddress: seedWallet,
//           excludeZeroValue: true,
//           category: ["erc20", "external"] as AssetTransfersCategory[],
//           withMetadata: true,
//           order: "desc" as SortingOrder,
//           maxCount: BlockChain.MaxTXCount,
//         });
//       } catch (err) {
//         retries++;
//         console.log(`Retrying call api after few sec`.red);
//         await delay(Delay.AlchemyAPI);
//       }
//     }

//     if (!incomingTxs) {
//       throw new Error(`Failed to fetch token transfers`);
//     }

//     console.log(
//       `Incoming transactions fetched (${incomingTxs.transfers.length}):`
//     );

//     // Initialize a set to store unique related wallets
//     const walletTxMap: Record<
//       string,
//       Set<AssetTransfersWithMetadataResult>
//     > = {};

//     // Helper function to add transactions to the map
//     const addToMap = (
//       address: string,
//       tx: AssetTransfersWithMetadataResult
//     ) => {
//       if (!walletTxMap[address]) {
//         walletTxMap[address] = new Set();
//       }
//       walletTxMap[address].add(tx);
//     };

//     // process outgoing transaction
//     outgoingTxs.transfers.forEach((tx) => {
//       if (
//         tx.to &&
//         tx.to.toLowerCase() !== seedWallet.toLowerCase() &&
//         (tx.asset === "ETH" || tx.asset === "WETH")
//       ) {
//         addToMap(tx.to, tx);
//       }
//     });

//     incomingTxs.transfers.forEach((tx) => {
//       if (
//         tx.from &&
//         tx.from.toLowerCase() !== seedWallet.toLowerCase() &&
//         (tx.asset === "ETH" || tx.asset === "WETH")
//       ) {
//         addToMap(tx.from, tx);
//       }
//     });

//     const relatedWalletArray = Object.entries(walletTxMap).map(
//       ([address, txSet]) => ({
//         address,
//         txs: Array.from(txSet),
//       })
//     );

//     return relatedWalletArray;
//   } catch (err) {
//     console.error(
//       `Error fetching transactions (alchemyApi.ts->getRelatedWallets): ${err}`
//     );
//     return [];
//   }
// };

// export const calculateProfitability = async (
//   address: string
// ): Promise<number> => {
//   let totalSpent = 0;
//   let totalReceived = 0;

//   try {
//     console.log("Fetching token transfers for address:".green, address);

//     let tokenTransfers_to: AssetTransfersWithMetadataResponse | null = null;
//     let retries = 0;
//     while (!tokenTransfers_to && retries < Delay.MaxRetries) {
//       try {
//         tokenTransfers_to = await alchemy.core.getAssetTransfers({
//           toAddress: address,
//           excludeZeroValue: true,
//           category: ["erc20", "external"] as AssetTransfersCategory[],
//           withMetadata: true,
//           order: "desc" as SortingOrder,
//           maxCount: BlockChain.MaxTXCount,
//         });
//       } catch (err) {
//         retries++;
//         console.log(`Retrying call api after few sec`.red);
//         await delay(Delay.AlchemyAPI);
//       }
//     }

//     if (!tokenTransfers_to) {
//       throw new Error(`Failed to fetch tokens transfers`.red);
//     }

//     console.log(
//       "Token transfers received (to):",
//       tokenTransfers_to.transfers.length
//     );

//     retries = 0;
//     let tokenTransfers_from: AssetTransfersWithMetadataResponse | null = null;
//     while (!tokenTransfers_from && retries < Delay.MaxRetries) {
//       try {
//         tokenTransfers_from = await alchemy.core.getAssetTransfers({
//           fromAddress: address,
//           excludeZeroValue: true,
//           category: ["erc20", "external"] as AssetTransfersCategory[],
//           withMetadata: true,
//           order: "desc" as SortingOrder,
//           maxCount: BlockChain.MaxTXCount,
//         });
//       } catch (err) {
//         retries++;
//         console.log(`Retrying call api after few sec`.red);
//         await delay(Delay.AlchemyAPI);
//       }
//     }

//     if (!tokenTransfers_from) {
//       throw new Error(`Failed to fetch token transfers`);
//     }

//     console.log(
//       "Token transfers sent (from):",
//       tokenTransfers_from.transfers.length
//     );

//     const tokenTransfers = [
//       ...tokenTransfers_to.transfers,
//       ...tokenTransfers_from.transfers,
//     ];
//     console.log("Combined token transfers:", tokenTransfers.length);

//     // Iterate through the token transfers and calculate the total received and spent
//     tokenTransfers.forEach((tx) => {
//       const value = tx.value ? tx.value : 0;
//       if (tx.to?.toLowerCase() === address.toLowerCase()) {
//         totalReceived += value; // Received tokens
//       }
//       if (tx.from?.toLowerCase() === address.toLowerCase()) {
//         totalSpent += value; // Spent tokens
//       }
//     });

//     console.log(`Total received: ${totalReceived}`);
//     console.log(`Total spent: ${totalSpent}`);
//   } catch (error) {
//     console.error("Error fetching token transfers:".red, error);
//     // Continue even if there is an error
//   }

//   // ROI = (totalReceived - totalSpent) / totalSpent
//   const profitability =
//     totalSpent > 0 ? (totalReceived - totalSpent) / totalSpent : 0;
//   console.log("Calculated profitability:", profitability);
//   return profitability;
// };

// export const categorizeEntity = async (wallet: string): Promise<string> => {
//   const code = await alchemy.core.getCode(wallet);

//   if (code !== "0x") return "Smart Contract"; // Contracts have code

//   // Placeholder logic for DEX pools and bridges (expand with real logic or APIs)
//   // we have to research these lists.
//   const knownDexPools = ["0x1F98431c8aD98523631AE4a59f267346ea31F984"];
//   if (knownDexPools.includes(wallet)) return "DEX Pool";

//   const knownBridges = ["0x1F98431c8aD98523631AE4a59f267346ea31F984"];
//   if (knownBridges.includes(wallet)) return "Bridge";

//   return "Wallet";
// };

export const getWalletTxsByAlchemy = async (address: string) => {
  let incomingTxs: TypeTransferTx[] = [];
  let retries = 0;

  while (!incomingTxs.length && retries < Delay.MaxRetries) {
    try {
      const data = await alchemy.core.getAssetTransfers({
        fromAddress: address,
        excludeZeroValue: true,
        category: ["erc20", "external"] as AssetTransfersCategory[],
        withMetadata: true,
        order: "desc" as SortingOrder,
        // maxCount: BlockChain.MaxTXCount,
      });

      incomingTxs = data.transfers
        .filter(
          (tx) =>
            new Date(tx.metadata.blockTimestamp).getTime() / 1000 >
            Math.floor(new Date().getTime() / 1000) -
              BlockChain.TxResultDuration
        )
        .map((tx) => ({
          blockNum: parseInt(tx.blockNum, 16),
          hash: tx.hash,
          from: tx.from || "",
          to: tx.to || "",
          value: tx.value || 0,
          tokenData: {
            address: tx.rawContract.address || "",
            decimal: parseInt(tx.rawContract.decimal || "0", 16),
            asset: tx.asset || "",
            category: tx.category as string,
          },
          blockTimestamp: Math.floor(
            new Date(tx.metadata.blockTimestamp).getTime() / 1000
          ),
        }));
      console.log("retireved successfully from getWalletTxByAlchemy");
      break;
    } catch (err) {
      retries++;
      console.log(`Retrying call api after few sec`.red);
      await delay(Delay.AlchemyAPI);
    }
  }

  retries = 0;
  let outcomingTxs: TypeTransferTx[] = [];
  while (!outcomingTxs.length && retries < Delay.MaxRetries) {
    try {
      const data = await alchemy.core.getAssetTransfers({
        toAddress: address,
        excludeZeroValue: true,
        category: ["erc20", "external"] as AssetTransfersCategory[],
        withMetadata: true,
        order: "desc" as SortingOrder,
        // maxCount: BlockChain.MaxTXCount,
      });

      outcomingTxs = data.transfers
        .filter(
          (tx) =>
            new Date(tx.metadata.blockTimestamp).getTime() / 1000 >
            Math.floor(new Date().getTime() / 1000) -
              BlockChain.TxResultDuration
        )
        .map((tx) => ({
          blockNum: parseInt(tx.blockNum, 16),
          hash: tx.hash,
          from: tx.from || "",
          to: tx.to || "",
          value: tx.value || 0,
          tokenData: {
            address: tx.rawContract.address || "",
            decimal: parseInt(tx.rawContract.decimal || "0", 16),
            asset: tx.asset || "",
            category: tx.category as string,
          },
          blockTimestamp: Math.floor(
            new Date(tx.metadata.blockTimestamp).getTime() / 1000
          ),
        }));
      console.log("retireved successfully from getWalletTxByAlchemy");
      break;
    } catch (err) {
      retries++;
      console.log(`Retrying call api after few sec`.red);
      await delay(Delay.AlchemyAPI);
    }
  }

  return [...incomingTxs, ...outcomingTxs];
};
