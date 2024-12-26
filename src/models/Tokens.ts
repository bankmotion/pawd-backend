import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Wallet from "./Wallets";

export interface TokenAttributes {
  id?: number;
  address?: string;
  name?: string;
  symbol?: string;
  decimal?: string;
  totalSupply?: string;
  timestamp: number;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, "id"> {}

class Token extends Model<TokenAttributes, TokenCreationAttributes> {}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    symbol: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    decimal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalSupply: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    timestamp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "tokens",
    timestamps: false,
  }
);

Token.hasMany(Wallet, { foreignKey: "tokenId", as: "wallets" });

export default Token;

