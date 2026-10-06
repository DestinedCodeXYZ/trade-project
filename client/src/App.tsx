import { useState } from 'react'
import './App.css'
import type { Candle } from './types/Candle'

function App() {

  const [instrument, setInstrument] = useState("eurusd");
  const [timeframe, setTimeframe] = useState("h1");
  const [from, setFrom] = useState(new Date("2023-01-01"));
  const [to, setTo] = useState(new Date("2023-02-01"));
  const [limit, setLimit] = useState(100);
  const [candles, setCandles] = useState<Candle[]>([]);


  const url = new URL(`http://localhost:3030/api/candles`);
  url.searchParams.set("instrument", instrument);
  url.searchParams.set("timeframe", timeframe);


  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }

  if (from) {
    url.searchParams.set("from", from.toISOString())
  }

  if (to) {
    url.searchParams.set("to", to.toISOString())
  }

  async function fetchData() {
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

  return (
    <>
    <div>
    <h1>Market Data Explorer</h1>
    </div> 
    <div>
      <p>Limit: 
        <input  
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        placeholder="Enter limit"
        />
      </p> 
      
      <p>Instrument: <input 
        type="text" 
        value={instrument} 
        onChange={(e) => setInstrument(e.target.value)} 
        placeholder="Enter instrument"
      />
      </p>
      
      <p className='base'>Timeframe: <input 
        type="text" 
        value={timeframe} 
        onChange={(e) => setTimeframe(e.target.value)} 
        placeholder="Enter timeframe"
      />
      </p>

      <p className='base'>From: 
        <input 
          type="datetime-local" 
          value={from.toISOString().slice(0, 16)} 
          onChange={(e) => setFrom(new Date(e.target.value))} 
          placeholder="2023-01-01T00:00"
        />
      </p>

      <p className='base'>To: 
        <input
          type="datetime-local" 
          value={to.toISOString().slice(0, 16)} 
          onChange={(e) => setTo(new Date(e.target.value))} 
          placeholder="2023-02-01T00:00"
        />
      </p>

      <button onClick={fetchData}>Fetch Data</button>
      <p>Candles: {candles.length}</p>
    </div>
    </>
  )
} 

export default App
