import { ColumnSetting, Index, IndexFormat, IndexSetting, Key } from "../model/basic";
import IndexSet from "../set/indexset";
import KeySet from "../set/keyset";
import RankSet from "../set/rankset";


export interface IControlPlane<K extends Key, I extends Index> {
    insert(key: K, index: I): void;
    remove(key: K): void;
    update(key: K, index: I): void;
    keys(index: I): K[];
    index(key: K): I;
    exists(key: K): boolean;
    rank(key: K): number;
}



export class ControlPlane<K extends Key, I extends Index> {

    keyset: KeySet<K, I>;
    indexset: IndexSet<K, I>;
    rankset: RankSet<I>;

    constructor(indexFormat: IndexFormat) {

        if (indexFormat.length === 0) {
            throw new Error("IndexFormat should contain at least one element.");
        }

        let indexSetting: IndexSetting = indexFormat.map<ColumnSetting>(element => ({
            order: element.order,
            lRange: element.min,
            rRange: element.max
        })) as IndexSetting;

        this.keyset = new KeySet();
        this.indexset = new IndexSet();
        this.rankset = new RankSet(indexSetting);
    }

    insert(key: K, index: I): void {
        this.keyset.insert(key, index);
        this.indexset.insert(key, index);
        this.rankset.increase(index);
    }

    remove(key: K): void {
        let index = this.indexset.index(key);
        if (!index) {
            throw new Error("Key does not exist.");
        }
        this.indexset.remove(key);
        this.keyset.remove(key, index);
        this.rankset.decrease(index);
    }

    update(key: K, index: I): void {
        let oldIndex = this.indexset.index(key);
        if (!oldIndex) {
            throw new Error("Key does not exist.");
        }
        this.indexset.update(key, index);
        this.keyset.remove(key, oldIndex);
        this.keyset.insert(key, index);
        this.rankset.decrease(oldIndex);
        this.rankset.increase(index);
    }

    keys(index: I): K[] {
        return this.keyset.keys(index);
    }

    index(key: K): I {
        return this.indexset.index(key) || (() => {throw new Error("Key does not exist.")})();
    }

    exists(key: K): boolean {
        return this.indexset.index(key) !== null;
    }

    rank(key: K): number {
        let index = this.indexset.index(key);
        if (!index) {
            throw new Error("Key does not exist.");
        }
        return this.rankset.rank(index);
    }
}