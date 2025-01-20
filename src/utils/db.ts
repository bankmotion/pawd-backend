import db from "../models";

export const deleteRecreateTable = async () => {
  await db.sequelize.sync({ alter: true, force: true });
  console.log("deleted and recreated the tables");
};

export const syncTable = async () => {
  await db.sequelize.sync();
};
