import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Token extends Model {
  public id!: number;
  public address!: string;
  public decimal!: number;
  public asset!: string;
  public category!: string;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    decimal: {
      type: DataTypes.INTEGER,
    },
    asset: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "tokens",
  }
);

export default Token;
