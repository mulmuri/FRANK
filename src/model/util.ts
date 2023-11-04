import { IndexFormatElement } from "./basic";

export type ToNumberArray<T extends any[]> = 
    T extends [IndexFormatElement, ...infer Rest] 
    ? [number, ...ToNumberArray<Rest>] 
    : [];

export type KeyMapping = {
    'string': string;
    'number': number;
    'bigint': bigint;
    'any':    any;
};