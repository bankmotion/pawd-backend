import { TypeToken } from "./TokenInt";

export interface TypeTransferTx {
  id?: number;
  from: string;
  to: string;
  value: number;
  hash: string;
  blockTimestamp: number;
  blockNum: number;
  tokenData: TypeToken;
}
