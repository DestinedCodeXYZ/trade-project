import { Component } from 'react';
import { useState } from 'react'
import './App.css'
import type { Candle } from './types/Candle'


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

  class Filters extends Component {
  render() {
    return (
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
          value={from.slice(0, 16)} 
          onChange={(e) => setFrom(e.target.value)} 
          placeholder="2023-01-01T00:00"
        />
      </p>

      <p className='base'>To: 
        <input
          type="datetime-local" 
          value={to.slice(0, 16)} 
          onChange={(e) => setTo(e.target.value)} 
          placeholder="2023-02-01T00:00"
        />
      </p>
      </div>
    )
  }
}

  class CandleList extends Component<{ candles: Candle[] }> {
    render() {
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
  }

  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }

  if (from) {
    url.searchParams.set("from", from)
  }

  if (to) {
    url.searchParams.set("to", to)
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
      <Filters />

      <button onClick={fetchData}>Fetch Data</button>
      <p>Candles: {candles.length}</p>

    </div>
    <div>
      <CandleList candles={candles} />
    </div>
    </>
  )
} 

export default App
