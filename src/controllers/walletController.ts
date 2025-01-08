import { Request, Response } from 'express';
import { getSeedWalletData, getWalletData } from '../services/walletService';

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

export const fetchWalletData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address, mainWalletAddress } = req.body;

    if (!address || !mainWalletAddress) {
      res.status(400).json({ error: 'Address and mainWalletAddress are required.' });
      return;
    }

    console.log(address, mainWalletAddress);

    const walletData = await getWalletData(address, mainWalletAddress);

    res.json(walletData);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching wallet data.' });
    return;
  }
}
