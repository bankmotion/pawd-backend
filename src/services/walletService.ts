import { isAddress } from "@ethersproject/address";
import {
  fetchWalletBalance,
  fetchWalletEthBalance,
  fetchWalletTxs,
  getRelatedWallets,
  calculateProfitability,
  categorizeEntity,
} from "../utils/alchemyApi";
import "colors";

// Define a type for the node objects
interface Node {
  address: string;
  balance: number;
}

// Define a type for the JSON output structure
interface JsonOutput {
  address: string;
  balance: number;
  nodes: Node[]; // An array of Node objects
}

// Simulate fetching data from a blockchain or external API
export const getSeedWalletData = async (
  seedWalletAddress: string
): Promise<{
  relatedWalletsWithProfitability: any[] | null;
  jsonOutput: JsonOutput;
}> => {
  // export const getSeedWalletData = async (seedWalletAddress: string) => {
  try {
    // Example API call to fetch wallet data
    const result = await startCrawler(seedWalletAddress);
    return result;
  } catch (error) {
    console.error("Error in getSeedWalletData:", error);
    throw new Error("Failed to fetch seed wallet data");
  }
};

export const getWalletData = async (address: string) => {
  try {
    const totalBalance = await fetchWalletBalance(address);
    console.log(totalBalance, "totalBalance");

    return totalBalance;
  } catch (error) {
    console.error("Error in getWalletData:", error);
    throw new Error("Failed to fetch wallet data");
  }
};

const startCrawler = async (
  seedWalletAddress: string
): Promise<{
  relatedWalletsWithProfitability: any[] | null;
  jsonOutput: JsonOutput;
}> => {
  const mainWallet = seedWalletAddress;

  // Fetch wallet transactions
  const relatedWallets = await getRelatedWallets(mainWallet);

  console.log(relatedWallets, "relatedWallet");

  const relatedWalletsWithProfitability = [];
  for (const wallet of relatedWallets) {
    const walletWithProfi = await calculateProfitability(wallet);
    relatedWalletsWithProfitability.push({
      wallet,
      profitability: walletWithProfi,
    });
  }

  console.log(`related wallet with profitability ended`.bgGreen);

  // const relatedWalletsWithProfitability = await Promise.all(
  //   relatedWallets.map(async (wallet) => ({
  //     wallet,
  //     profitability: await calculateProfitability(wallet),
  //   }))
  // );

  const categorizedWallets = await filterWalletCategories(
    relatedWalletsWithProfitability
  );

  console.log("category wallets".bgGreen, categorizedWallets);

  const mainWalletETHBalance = await fetchETHBalance(mainWallet);

  // Prepare the data structure to export as JSON
  const jsonOutput: JsonOutput = {
    address: mainWallet,
    balance: mainWalletETHBalance,
    nodes: [],
  };

  if (relatedWallets) {
    await fetchBalancesAndUpdateNodes(relatedWallets, jsonOutput);
  }

  console.log(
    jsonOutput,
    "jsonOutput",
    relatedWalletsWithProfitability,
    "relatedWalletsWithProfitability"
  );

  return { relatedWalletsWithProfitability, jsonOutput };
};

const fetchBalancesAndUpdateNodes = async (
  fromAddresses: string[],
  jsonOutput: JsonOutput
) => {
  // Create an array of promises

  const validAddresses = fromAddresses.filter((fromAddress) =>
    isAddress(fromAddress)
  );

  const balancePromises = validAddresses
    .slice(0, 100)
    .map(async (fromAddress: any) => {
      const fromAddressBalanceInUSD = await fetchETHBalance(fromAddress);
      return { fromAddress, fromAddressBalanceInUSD };
    });

  // Use Promise.all to wait for all promises to resolve
  const balances = await Promise.all(balancePromises);

  // Iterate over the resolved balances and update the jsonOutput.nodes
  balances.forEach(({ fromAddress, fromAddressBalanceInUSD }) => {
    console.log(
      fromAddress,
      typeof fromAddressBalanceInUSD,
      "fromAddress:fromAddressBalanceInUSD"
    );
    jsonOutput.nodes.push({
      address: fromAddress,
      balance: fromAddressBalanceInUSD,
    });
  });
};

const fetchETHBalance = async (walletAddress: string): Promise<number> => {
  try {
    const ethBalance = await fetchWalletEthBalance(walletAddress);
    return ethBalance ? parseFloat(ethBalance) : 0;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
};

const filterWalletCategories = async (
  relatedWalletsWithProfitability: { wallet: string; profitability: number }[]
): Promise<any[]> => {
  return Promise.all(
    relatedWalletsWithProfitability.map(async (wallet) => ({
      ...wallet,
      category: await categorizeEntity(wallet.wallet),
    }))
  );
};
