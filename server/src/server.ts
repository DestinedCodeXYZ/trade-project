import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import candleRoutes from "./routes/candleRoutes.js";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });

const app = express();

app.use(cors({
    origin: "*", // Allow all origins for development; adjust in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()}: ${req.method} ${req.url}`);
    next();
})

app.use("/api/candles", candleRoutes);


app.use(express.json());

async function startServer() {
    const databaseUri = process.env.DB_URI;
    if (!databaseUri) {
        throw new Error("DB_URI is not configured in the repository-root .env file.");
    }

    await mongoose.connect(databaseUri);
    console.log("Connected to MongoDB!");
    console.log("Database:", mongoose.connection.name);

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    })
}

startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});