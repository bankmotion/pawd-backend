import express, { Application } from 'express';
import cors from 'cors';
import walletRoutes from './routes/walletRoutes';

const app: Application = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/wallet', walletRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
