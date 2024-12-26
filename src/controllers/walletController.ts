import { Request, Response } from 'express';
import { getSeedWalletData } from '../services/walletService';

// Fetch wallet data based on address
export const fetchSeedWalletData = async (req: Request, res: Response): Promise<void> => {
  const { seedWalletAddress } = req.params;

  try {
    if (!seedWalletAddress) {
      res.status(400).json({ message: 'Seed wallet address is required' });
      return;
    }

    // Fetch wallet data using the service
    const walletData = await getSeedWalletData(seedWalletAddress);

    // Return the data
    res.status(200).json(walletData);
  } catch (error) {
    console.error('Error in fetchSeedWalletData:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
