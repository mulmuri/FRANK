import { Index, Key } from "../model/basic";



class IndexSet<K extends Key, I extends Index> {

    map: Map<K, I>;

    constructor() {
        this.map = new Map();
    }

    insert(key: K, index: I): void {
        if (this.map.has(key)) {
            throw new Error("Key already exists.");
        }
        this.map.set(key, index);
    }

    remove(key: K): void {
        if (!this.map.has(key)) {
            throw new Error("Key does not exist.");
        }
        this.map.delete(key);
    }

    update(key: K, index: I): void {
        if (!this.map.has(key)) {
            throw new Error("Key does not exist.");
        }
        this.map.set(key, index);
    }

    index(key: K): I | null {
        return this.map.get(key) || null;
    }
}

export default IndexSet;