import { Index, Key } from "../model/basic";



class KeySet<K extends Key, I extends Index> {

    map: Map<I, Set<K>>;

    constructor() {
        this.map = new Map();
    }

    insert(key: K, index: I): void {
        if (!this.map.has(index)) {
            this.map.set(index, new Set([key]));
        } else {
            this.map.get(index)!.add(key);
        }
    }

    remove(key: K, index: I): void {
        this.map.get(index)!.delete(key);
    }

    keys(index: I): K[] {
        return Array.from(this.map.get(index)!);
    }
}

export default KeySet;