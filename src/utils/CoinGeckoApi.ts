import axios from "axios";
import { APIKey, Delay } from "../config/config";
import { delay } from "./utils";

export const fetchTokenPrice = async (
  address: string,
  from: number,
  to: number
) => {
  let retries = 0;
  let data: any;

  while (!data && retries < Delay.MaxRetries) {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart/range?vs_currency=usd&from=${from}&to=${to}&x_cg_demo_api_key=${APIKey.CoinGeckoAPIKey}`;
      const options = {
        headers: { accept: "application/json" },
      };

      const response = await axios.get(url, options);
      data = response.data;
      break;
    } catch (err) {
      console.error(`Error fetching token price from coingecko api`, err);
      retries++;
      await delay(Delay.CoingeckoAPI);
    }
  }

  return data;
};
