import { DataTypes, Model, Optional } from "sequelize";
import Token from "./Tokens";
import sequelize from "../config/db";

export interface WalletAttributes {
  id?: number;
  address?: string;
  tokenId?: number;
  currentBalance?: string;
  outcomingBalance?: string;
  incomingBalance?: string;
  transferCount?: number;
  outcomingCount?: number;
  incomingCount?: number;
  creationTimestamp?: number;
  updateTimestamp?: number;
}

interface WalletCreationAttributes extends Optional<WalletAttributes, "id"> {}

class Wallet extends Model<WalletAttributes, WalletCreationAttributes> {}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Token,
        key: "id",
      },
    },
    currentBalance: {
      type: DataTypes.STRING,
    },
    outcomingBalance: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    incomingBalance: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    transferCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    outcomingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    incomingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    creationTimestamp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    updateTimestamp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "wallets",
    timestamps: false,
  }
);

Wallet.belongsTo(Token, { foreignKey: "tokenId", as: "token" });

export default Wallet;
