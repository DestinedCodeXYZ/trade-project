import type { Candle } from '../types/Candle';

export default function CandleList({candles}: { candles: Candle[] }) {

    return (
        <ul>
        {candles.map((candle) => (
          <li key={candle._id}>
            {candle.timestamp} - Open: {candle.open}, High: {candle.high}, Low: {candle.low}, Close: {candle.close}, Volume: {candle.volume}
          </li>
        ))}
      </ul>
    )
}