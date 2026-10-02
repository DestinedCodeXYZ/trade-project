import mongoose from "mongoose";
import express from "express";

import type { QueryFilter } from "mongoose";
import { getCandleCollection } from "../models/Candle.js";
import type { ICandle } from "../models/Candle.js";

const router = express.Router();

router.get("/:instrument/:timeframe/:id", async (req, res) => {
    try {

        const { instrument, timeframe, id } = req.params;

        if (!instrument || !timeframe || !id) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid candle ID" });
        }

        const collectionName = `candles_${instrument.toLowerCase()}_${timeframe.toLowerCase()}`;
        const tradedata = getCandleCollection(collectionName);

        const candle = await tradedata.findById(id);

        if (!candle) {
            return res.status(404).json({ error: "Candle not found" });
        }

        res.json(candle);
    }

    catch (err) {
        console.error("Error fetching candle:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/", async (req, res) => {

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

        // Constructing collection name based on instrument and timeframe
        const collectionName = `candles_${instrument.toLowerCase()}_${timeframe.toLowerCase()}`;
        const tradedata = getCandleCollection(collectionName);

        const filter: QueryFilter<ICandle> = {};   

        if (from || to) {
            
            filter.timestamp = {};
            
            let parsedFrom: Date | undefined;
            let parsedTo: Date | undefined;

            if (from) {
                parsedFrom = new Date(String(from));
                if (isNaN(parsedFrom.getTime())) {
                    return res.status(400).json({ error: "Invalid 'from' date parameter" });
                }
                filter.timestamp.$gte = parsedFrom;
            }

            if (to) {
                parsedTo = new Date(String(to));
                if (isNaN(parsedTo.getTime())) {
                    return res.status(400).json({ error: "Invalid 'to' date parameter" });
                }
                filter.timestamp.$lte = parsedTo;
            }

            if (parsedFrom && parsedTo && parsedFrom > parsedTo) {
                return res.status(400).json({ error: "'from' date cannot be later than 'to' date" });
            }
        }



        let queryLimit = 100;
        let queryCap = 1000;

        // Checking limit parameter and validating it
        if (limit) {
            if (typeof limit !== "string") {
                return res.status(400).json({ error: "Invalid limit parameter" });
            }

            const parsedLimit = Number(limit as string);

            if(!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > queryCap) {
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

export default router;