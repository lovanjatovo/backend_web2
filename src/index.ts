import express from "express";
import dotenv from "dotenv";

import { corsConfig } from "./configuration/cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(corsConfig);
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});