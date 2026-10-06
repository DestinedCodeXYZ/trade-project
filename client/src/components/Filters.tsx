import type { FilterProps } from '../types/Filters';

export default function Filters({instrument, timeframe, from, to, limit, onInstrumentChange, onTimeframeChange, onFromChange, onToChange, onLimitChange}: FilterProps) {

        return (
        <div>
            <p>Limit: 
            <input  
            type="number"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            placeholder="Enter limit"
            />
        </p> 
        
        <p>Instrument: <input 
            type="text" 
            value={instrument} 
            onChange={(e) => onInstrumentChange(e.target.value)} 
            placeholder="Enter instrument"
        />
        </p>
        
        <p className='base'>Timeframe: <input 
            type="text" 
            value={timeframe} 
            onChange={(e) => onTimeframeChange(e.target.value)} 
            placeholder="Enter timeframe"
        />
        </p>

        <p className='base'>From: 
            <input 
            type="datetime-local" 
            value={from.slice(0, 16)} 
            onChange={(e) => onFromChange(e.target.value)} 
            placeholder="2023-01-01T00:00"
            />
        </p>

        <p className='base'>To: 
            <input
            type="datetime-local" 
            value={to.slice(0, 16)} 
            onChange={(e) => onToChange(e.target.value)} 
            placeholder="2023-02-01T00:00"
            />
        </p>
        </div>
        )
}