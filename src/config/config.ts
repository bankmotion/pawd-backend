import dotenv from "dotenv";
dotenv.config();

export const DBConfig = {
  Name: process.env.DB_NAME || "pawd",
  User: process.env.DB_USER || "root",
  PWD: process.env.DB_PWD || "pawdPAWD123!@#",
  Host: process.env.DB_HOST || "localhost",
  Port: Number(process.env.DB_PORT) || 3306,
};

export const APIKey = {
  AlchemyAPIKey: process.env.ALCHEMY_API_KEY || "",
  MoralisAPIKey: process.env.MORALIS_API_KEY || "",
  CoinGeckoAPIKey: process.env.COINGECKO_API_KEY || "",
};

export const BlockChain = {
  BlockTime: 10,
  MaxTXCount: 50,
  TxResultDuration: 30 * 24 * 3600,
};

export const Delay = {
  AlchemyAPI: 0.3,
  MaxRetries: 5,
  CoingeckoAPI: 0.5,
};

export const Addresses = {
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};
