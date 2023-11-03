import { Index, Key } from "../model/basic";

class FrankError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidIndexFormatLengthError extends FrankError {
    constructor() {
        super("Index format should contain at least one element, received empty array.");
        this.name = "Invalid Index Format Length Error";
    }
}

export class InvalidIndexFormatRangeError extends FrankError {
    constructor() {
        super("rRange should be greater than lRange.");
        this.name = "Invalid Index Format Range Error";
    }
}


export class KeyNotExistsError<K extends Key> extends FrankError {
    constructor(key: K) {
        super(`Key: ${key} does not exist.`);
        this.name = "Key Not Exists Error";
    }
}

export class DuplicateKeyError<K extends Key> extends FrankError {
    constructor(key: K) {
        super(`Key: ${key} already exists.`);
        this.name = "Duplicate Key Error";
    }
}

export class InvalidIndexRangeError<I extends Index> extends FrankError {
    constructor(index: I) {
        super(`Index: ${index} has invalid range`);
        this.name = "Invalid Index Range Error";
    }
}