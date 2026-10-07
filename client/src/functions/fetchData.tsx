import type { Candle } from '../types/Candle';

export default async function fetchData(url: string) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Candle[] = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}