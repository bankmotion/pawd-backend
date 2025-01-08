import {
    Alchemy,
    AssetTransfersCategory,
    Network,
    SortingOrder,
} from "alchemy-sdk";
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { APIKey } from "../config/config";


const settings = {
    apiKey: APIKey.AlchemyAPIKey,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const web3 = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${APIKey.AlchemyAPIKey}`);


export const fetchWalletTxs = async (wallet: string) => {
    try {
        const transfers = await alchemy.core.getAssetTransfers({
            fromAddress: wallet,
            excludeZeroValue: true,
            category: ["erc20", "external"] as AssetTransfersCategory[],
            withMetadata: true,
            order: "desc" as SortingOrder,
        });

        return transfers.transfers;
    } catch (err) {
        console.error(
            `Error: fetching trasactions(alchemyApi.ts->fetchWalletTxs): ${err}`
        );
        return null;
    }
};

export const fetchAllWalletTxs = async (wallet: string) => {
    try {
        const transfers_from = await alchemy.core.getAssetTransfers({
            fromAddress: wallet,
            excludeZeroValue: true,
            category: ["erc20", "external"] as AssetTransfersCategory[],
            withMetadata: true,
            order: "desc" as SortingOrder,
        });

        const transfers_to = await alchemy.core.getAssetTransfers({
            toAddress: wallet,
            excludeZeroValue: true,
            category: ["erc20", "external"] as AssetTransfersCategory[],
            withMetadata: true,
            order: "desc" as SortingOrder,
        });

        const combinedTransfers = [
            ...(transfers_from.transfers || []),
            ...(transfers_to.transfers || []),
        ];

        return combinedTransfers;
    } catch (err) {
        console.error(
            `Error: fetching trasactions(alchemyApi.ts->fetchWalletTxs): ${err}`
        );
        return null;
    }
};


// Helper function to fetch the token price
export const fetchWalletEthBalance = async (wallet: string) => {
    try {
        const balanceWei = await web3.eth.getBalance(wallet);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        console.log(`ETH balance for ${wallet}: ${balanceEth} ETH`);
        return balanceEth;
    } catch (err) {
        console.error(
            `Error: fetching Eth Balance: ${err}`
        );
        return null;
    }
}

export const fetchWalletBalance = async (walletAddress: string): Promise<{
    nativeBalance: string;
    tokenBalances: { tokenAddress: string; tokenSymbol: string; balance: string }[];
}> => {
    try {
        const nativeBalanceInWei = await alchemy.core.getBalance(walletAddress);
        const nativeBalance = Number(web3.utils.fromWei(nativeBalanceInWei.toString(), 'ether')).toFixed(4); // Convert from Wei to ETH and format

        const tokenBalancesResponse = await alchemy.core.getTokenBalances(walletAddress);

        const tokenBalances = await Promise.all(
            tokenBalancesResponse.tokenBalances.map(async (token) => {
                const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
                return {
                    tokenAddress: token.contractAddress,
                    tokenSymbol: metadata.symbol || "UNKNOWN",
                    balance: (Number(token.tokenBalance) / 10 ** (metadata.decimals || 18)).toFixed(4), // Convert to human-readable format
                };
            })
        );

        const filteredTokenBalances = tokenBalances.filter(
            (token) => Number(token.balance) > 0
        );

        return {
            nativeBalance,
            tokenBalances: filteredTokenBalances,
        };
    }
    catch (error) {
        console.error("Error fetching wallet balance:", error);
        throw new Error("Failed to fetch wallet balance.");
    }

}
