import { useState, useEffect } from 'react'
import './App.css'
import type { Candle } from './types/Candle'
import CandleList from './components/CandleList';
import Filters from './components/Filters';
import fetchData from './functions/fetchData';

function App() {

  const [instrument, setInstrument] = useState("eurusd");
  const [timeframe, setTimeframe] = useState("h1");
  const [from, setFrom] = useState("2023-01-01T00:00");
  const [to, setTo] = useState("2023-02-01T00:00");
  const [limit, setLimit] = useState(100);
  const [candles, setCandles] = useState<Candle[]>([]);


  const url = new URL(`http://localhost:3030/api/candles`);
  url.searchParams.set("instrument", instrument);
  url.searchParams.set("timeframe", timeframe);

  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }

  if (from) {
    url.searchParams.set("from", from)
  }

  if (to) {
    url.searchParams.set("to", to)
  }

  useEffect(() => {
    fetchData(url.toString(), setCandles);
  }, [instrument, timeframe, from, to, limit]);

  return (
    <>
    <div>
    <h1>Market Data Explorer</h1>
    </div> 
    <div>
      <p>
        {
          Filters({
            instrument,
            timeframe,
            from,
            to,
            limit,
            onInstrumentChange: setInstrument,
            onTimeframeChange: setTimeframe,
            onFromChange: setFrom,
            onToChange: setTo,
            onLimitChange: setLimit
          })
        }
        </p> 

      <button onClick={() => fetchData(url.toString(), setCandles)}>Load Candles</button>
      <p>Candles: {candles.length}</p>

    </div>
    <div>
      <p>View candles below: {CandleList({candles})}</p>
    </div>
    </>
  )
} 

export default App
