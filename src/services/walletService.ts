import { fetchWalletBalance, fetchWalletEthBalance, fetchWalletTxs } from "../utils/alchemyApi";

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
export const getSeedWalletData = async (seedWalletAddress: string): Promise<{ walletTxs: any[] | null; jsonOutput: JsonOutput }> => {
    try {
        // Example API call to fetch wallet data
        const result = await startCrawler(seedWalletAddress);
        return result;
    } catch (error) {
        console.error('Error in getSeedWalletData:', error);
        throw new Error('Failed to fetch seed wallet data');
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

const startCrawler = async (seedWalletAddress: string): Promise<{ walletTxs: any[] | null; jsonOutput: JsonOutput }> => {

    const mainWallet = seedWalletAddress;

    // Fetch wallet transactions
    const walletTxs = await fetchWalletTxs(mainWallet);

    // Extract the "from" wallet addresses
    const fromAddresses = walletTxs?.map((tx: any) => tx.from).filter((address, index, self) => self.indexOf(address) === index);

    console.log(fromAddresses!.length, "To Wallet Addresses");

    const mainWalletETHBalance = await fetchETHBalance(mainWallet);

    // Prepare the data structure to export as JSON
    const jsonOutput: JsonOutput = {
        address: mainWallet,
        balance: mainWalletETHBalance,
        nodes: []
    };

    if (fromAddresses) {
        await fetchBalancesAndUpdateNodes(fromAddresses, jsonOutput);
    }

    console.log(jsonOutput, "jsonOutput");

    return { walletTxs, jsonOutput };

};

const fetchBalancesAndUpdateNodes = async (fromAddresses: string[], jsonOutput: JsonOutput) => {
    // Create an array of promises
    const balancePromises = fromAddresses.slice(0, 100).map(async (fromAddress: any) => {
        const fromAddressBalanceInUSD = await fetchETHBalance(fromAddress);
        return { fromAddress, fromAddressBalanceInUSD };
    });

    // Use Promise.all to wait for all promises to resolve
    const balances = await Promise.all(balancePromises);

    // Iterate over the resolved balances and update the jsonOutput.nodes
    balances.forEach(({ fromAddress, fromAddressBalanceInUSD }) => {
        console.log(fromAddress, typeof (fromAddressBalanceInUSD), "fromAddress:fromAddressBalanceInUSD");
        jsonOutput.nodes.push({
            address: fromAddress,
            balance: fromAddressBalanceInUSD
        });
    });
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



