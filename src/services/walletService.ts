import { promises } from "dns";
import { fetchWalletEthBalance, fetchWalletTxs } from "../utils/alchemyApi";


// Simulate fetching data from a blockchain or external API
export const getSeedWalletData = async (seedWalletAddress: string): Promise<any> => {
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

const startCrawler = async (seedWalletAddress: string) => {
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

    // Fetch balance and creation time for each "to" address
    if (toAddresses)
        for (const toAddress of toAddresses) {
            const toAddressBalanceInUSD = await fetchETHBalance(toAddress);

            // Push the toAddress info into the nodes array
            jsonOutput.nodes.push({
                address: toAddress,
                balance: toAddressBalanceInUSD
            });
        }
    console.log("JSON data has been saved to wallet_data.json");

    console.log(jsonOutput, "jsonOutput")
    return jsonOutput;


};
