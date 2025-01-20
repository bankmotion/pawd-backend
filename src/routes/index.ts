import express from "express";

import walletRouter from "./WalletRouter";

const router = express.Router();

router.use("/wallet", walletRouter);

export default router;
