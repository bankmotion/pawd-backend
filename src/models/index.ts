import sequelize from "../config/db";
import Token from "./TokenModel";
import TransferTx from "./TransferTxModel";

// TransferTx.hasOne(Token, {
//   foreignKey: "tokenId",
//   as: "token",
//   constraints: false,
// });

const db = {
  sequelize,
  TransferTx,
  Token,
};

export default db;
