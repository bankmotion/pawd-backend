import {
    Alchemy,
    AssetTransfersCategory,
    Network,
    SortingOrder,
    TokenBalance,
} from "alchemy-sdk";
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { APIKey} from "../config/config";


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
