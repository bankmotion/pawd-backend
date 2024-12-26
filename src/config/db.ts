import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { DBConfig } from "./config";

// Load environment variables
dotenv.config();

const sequelize = new Sequelize(DBConfig.Name, DBConfig.User, DBConfig.PWD, {
  host: DBConfig.Host,
  port: DBConfig.Port,
  dialect: "mysql",
  logging: false
});

export default sequelize;
