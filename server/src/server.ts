import mongoose from "mongoose";
import type { QueryFilter } from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { getCandleCollection } from "./models/Candle.js";
import type { ICandle } from "./models/Candle.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API is running!"
    })
});


app.get("/api/candles", async (req, res) => {

    try {

        const { timeframe, instrument, limit, from, to } = req.query;

        console.log("instrument:", instrument);
        console.log("timeframe:", timeframe);

        if (!timeframe || !instrument) {
            return res.status(400).json({ error: "Missing query parameters" }); // Likely to change later - maybe have only instrument as mandatory
        }
        
        if ( typeof timeframe !== "string" || typeof instrument !== "string" ) {
            return res.status(400).json({ error: "Invalid query parameters" });
        }

        

        const collectionName = `candles_${instrument.toLowerCase()}_${timeframe.toLowerCase()}`;
        const tradedata = getCandleCollection(collectionName);

        const filter: QueryFilter<ICandle> = {};   

        if (from || to) {
            
            filter.timestamp = {};
            
            if (from) {
                filter.timestamp.$gte = new Date(String(from))
            }

            if (to) {
                filter.timestamp.$lte = new Date(String(to));
            }
        }

        let queryLimit = 100;

        if (limit) {
            const parsedLimit = parseInt(limit as string);

            if(isNaN(parsedLimit) || parsedLimit <= 0) {
                return res.status(400).json({ error: "Invalid limit parameter" });
            }
            queryLimit = parsedLimit;
        }

        const candles = await tradedata.find(filter).limit(queryLimit).sort({ timestamp: -1 });

        console.log("Fetched candles:", candles.length);

        res.json(candles);
        
    } 
    
    catch (err) {
        console.error("Error fetching candles:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }   
})

app.get("/api/candles/:instrument/:timeframe/:id", async (req, res) => {
    try {
        
        const { instrument, timeframe, id } = req.params;

        if (!instrument || !timeframe || !id) {
            return res.status(400).json({ error: "Missing parameters" });
        }
    }

    catch (err) {
        console.error("Error fetching candle:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

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