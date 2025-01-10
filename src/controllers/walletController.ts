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

// Fetch the balances of wallet
export const fetchWalletData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address} = req.body;
    console.log(address,'address')
    if (!address) {
      res.status(400).json({ error: 'Address is required.' });
      return;
    }

    console.log(address);

    const walletData = await getWalletData(address);

    res.json(walletData);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching wallet data.' });
    return;
  }
}
