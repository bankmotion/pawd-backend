import express from "express";
import { getDataForWallet } from "../controllers/WalletController";

const router = express.Router();

router.get("/address/:address", getDataForWallet);

export default router;
