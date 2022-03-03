export interface SessionData {
    id: number;
    date: number;
    location: string;
    smallBlind: number;
    bigBlind: number;
    straddle?: number;
    moneyIn: number;
    moneyOut: number;
}