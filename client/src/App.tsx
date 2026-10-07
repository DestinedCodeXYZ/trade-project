import { useState, useEffect } from 'react'
import './App.css'
import type { Candle } from './types/Candle'
import CandleList from './components/CandleList';
import Filters from './components/Filters';
import fetchData from './functions/fetchData';
import Loading from './components/Loading';

function App() {

  const [instrument, setInstrument] = useState("eurusd");
  const [timeframe, setTimeframe] = useState("h1");
  const [from, setFrom] = useState("2023-01-01T00:00");
  const [to, setTo] = useState("2023-02-01T00:00");
  const [limit, setLimit] = useState(100);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function loadCandles() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchData(url.toString());
      setCandles(data);

    } catch (error) {
      console.log(`ERROR: ${error}`)
      if (error instanceof Error) {
        setError(error.message);
      } else {setError("An unknown error occurred.")}

    } finally { setIsLoading(false) }
  }

  useEffect(() => {
    loadCandles();
  }, []);

  return (
    <>
    <div>
    <h1>Market Data Explorer</h1>
    </div> 
    <div>
      <Filters
        instrument={instrument}
        timeframe={timeframe}
        from={from}
        to={to}
        limit={limit}
        onInstrumentChange={setInstrument}
        onTimeframeChange={setTimeframe}
        onFromChange={setFrom}
        onToChange={setTo}
        onLimitChange={setLimit}  
      /> 

      <button onClick={() => loadCandles()}>Load Candles</button>
      <br/>
      <p>Candles: {candles.length}</p>
    </div>
    <div>
      <p>View candles below: </p>
        {isLoading ? <Loading /> : error ? <p> {error} </p> : <CandleList candles={candles} />}
    </div>
    </>
  )
} 

export default App
