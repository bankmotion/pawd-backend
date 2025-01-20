import { TypeToken } from "./TokenInt";

export interface TypeTransferTx {
  id?: number;
  from: string;
  to: string;
  value: number | string;
  hash: string;
  blockTimestamp: number;
  blockNum: number;
  tokenData: TypeToken;
}
