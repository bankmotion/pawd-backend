import { Router } from 'express';
import { fetchSeedWalletData, fetchWalletData } from '../controllers/walletController';

const router = Router();

// Define route for fetching wallet data
router.get('/:seedWalletAddress', fetchSeedWalletData);
router.post('/data', fetchWalletData);

export default router;
