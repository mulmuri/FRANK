export interface IRankAggs {
    inc(index: number): void;
    dec(index: number): void;
    rank(index: number): number;
    exists(index: number): boolean;
    size(): number;
}