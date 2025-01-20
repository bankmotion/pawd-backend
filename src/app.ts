import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
