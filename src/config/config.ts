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
};

export const BlockChain = {
  BlockTime: 10,
  MaxTXCount: 50,
};

export const Delay = {
  AlchemyAPI: 0.3,
  MaxRetries: 5,
};

export const tokenPrices = {
  "1inch": 0.419362,
  ampleforth: 1.33,
  apecoin: 1.25,
  "axie-infinity": 6.75,
  axion: 0.00000129,
  "basic-attention-token": 0.26259,
  beam: 0.068222,
  chainlink: 24.47,
  dai: 0.999992,
  dextools: 0.457467,
  dydx: 1.56,
  "e-radix": 0.02483084,
  "ethereum-name-service": 35.71,
  fantom: 0.972634,
  gala: 0.03846209,
  hedron: 7.9262e-8,
  hex: 0.00405413,
  kleros: 0.02169007,
  livepeer: 19.13,
  loopring: 0.215522,
  mantle: 1.24,
  "mask-network": 3.18,
  minereum: 0.00801947,
  "mirror-protocol": 0.02481552,
  pepecat: 0.00000582,
  pulsedogecoin: 0.04802458,
  qanplatform: 0.064096,
  roulettebot: 0.00279902,
  "shiba-inu": 0.00002287,
  soldoge: 0.00001935,
  sushi: 1.6,
  tether: 0.999042,
  tetra: 0.00016267,
  titanx: 5.74476e-7,
  tokemak: 0.646905,
  uniswap: 13.85,
  "usd-coin": 0.999973,
  vmpx: 0.01694565,
  wait: 0.0010418,
  weth: 3467.25,
};
