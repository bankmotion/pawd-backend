import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class TransferTx extends Model {
  public id!: number;
  public from!: string;
  public to!: string;
  public value!: string;
  public hash!: string;
  public blockTimestamp!: number;
  public blockNum!: number;
  public tokenId!: number;
  public price!: number;
}

TransferTx.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      defaultValue: "0",
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockTimestamp: {
      type: DataTypes.INTEGER,
    },
    blockNum: {
      type: DataTypes.INTEGER,
    },
    tokenId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(18, 10),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "transferTxs",
  }
);

export default TransferTx;
