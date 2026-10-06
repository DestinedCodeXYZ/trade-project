export interface FilterProps {
    instrument: string;
    timeframe: string;
    from: string;
    to: string;
    limit: number;

    onInstrumentChange: (value: string) => void;
    onTimeframeChange: (value: string) => void;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    onLimitChange: (value: number) => void;
}