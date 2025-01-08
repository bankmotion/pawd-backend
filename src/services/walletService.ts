import { promises } from "dns";
import { fetchWalletBalance, fetchWalletEthBalance, fetchWalletTxs, fetchAllWalletTxs } from "../utils/alchemyApi";


// Simulate fetching data from a blockchain or external API
export const getSeedWalletData = async (seedWalletAddress: string): Promise<JsonOutput> => {
    try {
        // Example API call to fetch wallet data
        const result = await startCrawler(seedWalletAddress);
        return result;
    } catch (error) {
        console.error('Error in getSeedWalletData:', error);
        throw new Error('Failed to fetch seed wallet data');
    }
};

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

const fetchETHBalance = async (walletAddress: string): Promise<number> => {
    try {
        const ethBalance = await fetchWalletEthBalance(walletAddress);
        return ethBalance ? parseFloat(ethBalance) : 0;
    } catch (error) {
        console.error("Error fetching balance:", error);
        return 0;
    }
}

const startCrawler = async (seedWalletAddress: string): Promise<JsonOutput> => {
    // const mainWallet: string = "0x00a8ac72bd166067b629f6111ddfde7570ce482a";

    const mainWallet = seedWalletAddress;

    // Fetch wallet transactions
    const walletTxs = await fetchWalletTxs(mainWallet);
    console.log(walletTxs?.length, walletTxs![0], "walletTxs");

    // Extract the "to" wallet addresses
    const toAddresses = walletTxs?.map((tx: any) => tx.to).filter((address, index, self) => self.indexOf(address) === index);
    console.log(toAddresses!.length, "To Wallet Addresses");

    const mainWalletETHBalance = await fetchETHBalance(mainWallet);

    // Prepare the data structure to export as JSON
    const jsonOutput: JsonOutput = {
        address: mainWallet,
        balance: mainWalletETHBalance,
        nodes: []
    };

    if (toAddresses) {
        await fetchBalancesAndUpdateNodes(toAddresses, jsonOutput);
    }

    console.log(jsonOutput, "jsonOutput");

    return jsonOutput;

};

const fetchBalancesAndUpdateNodes = async (toAddresses: string[], jsonOutput: JsonOutput) => {
    // Create an array of promises
    const balancePromises = toAddresses.slice(0, 100).map(async (toAddress: any) => {
        const toAddressBalanceInUSD = await fetchETHBalance(toAddress);
        return { toAddress, toAddressBalanceInUSD };
    });

    // Use Promise.all to wait for all promises to resolve
    const balances = await Promise.all(balancePromises);

    // Iterate over the resolved balances and update the jsonOutput.nodes
    balances.forEach(({ toAddress, toAddressBalanceInUSD }) => {
        console.log(toAddress, typeof (toAddressBalanceInUSD), "toAddress:toAddressBalanceInUSD");
        jsonOutput.nodes.push({
            address: toAddress,
            balance: toAddressBalanceInUSD
        });
    });
}

export const getWalletData = async (address: string, mainWalletAddress: string) => {
    try {
        const totalBalance = await fetchWalletBalance(address);
        console.log(totalBalance, "totalBalance");

        // Fetch all transactions for the given wallet
        const transactions = await fetchAllWalletTxs(address);

        if (!transactions) {
            throw new Error("Failed to fetch transactions");
        }

        // Filter transactions where either `from` or `to` matches `mainWalletAddress`
        const filteredTransactions = transactions.filter((tx) => {
            return (
                tx.from == mainWalletAddress ||
                tx.to == mainWalletAddress
            );
        });

        console.log(filteredTransactions, "filteredTransactions")

        return {
            totalBalance,
            transactions: filteredTransactions,
        };
    } catch (error) {
        console.error("Error in getWalletData:", error);
        throw new Error("Failed to fetch wallet data");
    }
};


