import { Router } from 'express';
import { fetchSeedWalletData } from '../controllers/walletController';

const router = Router();

// Define route for fetching wallet data
router.get('/:seedWalletAddress', fetchSeedWalletData);

export default router;
