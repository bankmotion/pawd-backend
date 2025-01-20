import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";

const app: Application = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
