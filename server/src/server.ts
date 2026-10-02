import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

import candleRoutes from "./routes/candleRoutes.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()}: ${req.method} ${req.url}`);
    next();
})

app.use("/api/candles", candleRoutes);


app.use(express.json());

async function startServer() {
    await mongoose.connect(process.env.DB_URI!);
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