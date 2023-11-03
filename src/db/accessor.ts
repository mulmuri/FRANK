import { ColumnSetting, Index, IndexFormat, IndexSetting, Key } from "../model/basic";
import IndexSet from "../set/indexset";
import KeySet from "../set/keyset";
import RankSet from "../set/rankset";
import { FrankError, InvalidIndexFormatLengthError, InvalidIndexFormatRangeError, InvalidIndexRangeError, KeyNotExistsError, UnexpectedError } from "./errors";


export interface IAccessPlane<K extends Key, I extends Index> {
    insert(key: K, index: I): void;
    remove(key: K): void;
    update(key: K, index: I): void;
    keys(index: I): K[];
    index(key: K): I;
    exists(key: K): boolean;
    rank(key: K): number;
}



export class AccessPlane<K extends Key, I extends Index> {

    keyset: KeySet<K, I>;
    indexset: IndexSet<K, I>;
    rankset: RankSet<I>;

    indexFormat: IndexFormat;

    constructor(indexFormat: IndexFormat) {

        if (indexFormat.length === 0) {
            throw new InvalidIndexFormatLengthError();
        }
        this.indexFormat = indexFormat;

        let indexSetting: IndexSetting = indexFormat.map<ColumnSetting>(element => ({
            order: element.order,
            lRange: element.min,
            rRange: element.max
        })) as IndexSetting;

        indexSetting.map(element => {
            if (element.lRange > element.rRange) {
                throw new InvalidIndexFormatRangeError()
            }
        });

        this.keyset = new KeySet();
        this.indexset = new IndexSet();
        this.rankset = new RankSet(indexSetting);
    }

    private isIndexValid(index: I): boolean {
        for (let [i, e] of index.entries()) {
            if (e < this.indexFormat[i].min || e > this.indexFormat[i].max) {
                return false;
            }
        }
        return true;
    }

    insert(key: K, index: I): void {
        if (this.isIndexValid(index) === false) {
            throw new InvalidIndexRangeError(index);
        }

        try {
            this.keyset.insert(key, index);
            this.indexset.insert(key, index);
            this.rankset.increase(index);
        } catch (error: any) {
            if (error instanceof FrankError) {
                throw error;
            } else {
                throw new UnexpectedError(error);
            }
        }
    }

    remove(key: K): void {

        try {
            let index = this.indexset.index(key);
            if (!index) {
                throw new KeyNotExistsError(key);
            }
            this.indexset.remove(key);
            this.keyset.remove(key, index);
            this.rankset.decrease(index);

        } catch (error: any) {
            if (error instanceof FrankError) {
                throw error;
            } else {
                throw new UnexpectedError(error);
            }
        }
    }

    update(key: K, index: I): void {
        
        try {
            let oldIndex = this.indexset.index(key);
            if (!oldIndex) {
                throw new KeyNotExistsError(key);
            }
            this.indexset.update(key, index);
            this.keyset.remove(key, oldIndex);
            this.keyset.insert(key, index);
            this.rankset.decrease(oldIndex);
            this.rankset.increase(index);
        } catch (error: any) {
            if (error instanceof FrankError) {
                throw error;
            } else {
                throw new UnexpectedError(error);
            }
        }
    }

    keys(index: I): K[] {
        try {
            return this.keyset.keys(index);            
        } catch (error: any) {
            if (error instanceof FrankError) {
                throw error;
            } else {
                throw new UnexpectedError(error);
            }
        }
    }

    index(key: K): I {
        try {
            let index = this.indexset.index(key);
            if (!index) {
                throw new KeyNotExistsError(key);
            }
            return index;
        } catch (error: any) {
            if (error instanceof FrankError) {
                throw error;
            } else {
                throw new UnexpectedError(error);
            }
        }
    }

    exists(key: K): boolean {
        try {
            return this.indexset.index(key) !== null;
        } catch (error: any) {
            if (error instanceof FrankError) {
                throw error;
            } else {
                throw new UnexpectedError(error);
            }
        }
    }

    rank(key: K): number {
        try {
            let index = this.indexset.index(key);
            if (!index) {
                throw new KeyNotExistsError(key);
            }
            return this.rankset.rank(index);
        } catch (error: any) {
            if (error instanceof FrankError) {
                throw error;
            } else {
                throw new UnexpectedError(error);
            }
        }
    }
}