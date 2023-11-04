export type Key = string | number | bigint | any;
export type Index = [number, ...number[]]
export type Rank = number;
export type Order = 'asc' | 'desc';

export type Record = {
    key: Key,
    index: Index,
}

export type Result = {
    key: Key,
    index: [Index],
    rank: Rank,
}

export type ColumnSetting = {
    order: Order,
    lRange: number,
    rRange: number,
}

export type IndexSetting = [ColumnSetting, ...ColumnSetting[]];


export type IndexFormatElement = {
    min: number,
    max: number,
    order: Order,
}

export type IndexFormat = [IndexFormatElement, ...IndexFormatElement[]];