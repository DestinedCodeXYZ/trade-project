import type { Candle } from '../types/Candle';

export default async function fetchData(url: string, setCandles: (candles: Candle[]) => void) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Candle[] = await response.json();
        console.log(data);
        setCandles(data);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}