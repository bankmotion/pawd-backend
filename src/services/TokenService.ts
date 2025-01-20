import { TypeToken } from "../interface/TokenInt";
import db from "../models";

export const getTokenInfo = async (address: string) => {
  try {
    const token = await db.Token.findOne({ where: { address } });
    return token;
  } catch (err) {
    console.log(`TokenService~getTokenInfo() ERROR ${err}`.red);
  }
};

export const createTokenInfo = async (token: TypeToken) => {
  try {
    const data = await db.Token.create({ ...token });
    return data;
  } catch (err) {
    console.log(`TokenService~createTokenInfo() ERROR ${err}`.red);
  }
};
