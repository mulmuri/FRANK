import { Index, Key } from "../model/basic";


class KeySet<K extends Key, I extends Index> {

    map: Map<bigint, Set<K>>;

    constructor() {
        this.map = new Map<bigint, Set<K>>();
    }

    private serialize(index: I): bigint {
        let result = BigInt(0);
        for (let i = 0; i < index.length; i++) {
            result = result * BigInt(1 << 64) + BigInt(index[i]);
        }
        return result;
    }

    private deserialize(index: bigint): I {
        let result: I = [] as unknown as I;
        while (index > BigInt(0)) {
            result.push(Number(index % BigInt(1 << 64)));
            index = index / BigInt(1 << 64);
        }
        return result;
    }

    insert(key: K, index: I): void {

        const serializedIndex = this.serialize(index);

        if (!this.map.has(serializedIndex)) {
            this.map.set(serializedIndex, new Set([key]));
        } else {
            this.map.get(serializedIndex)!.add(key);
        }
    }

    remove(key: K, index: I): void {
        const serializedIndex = this.serialize(index);
        this.map.get(serializedIndex)!.delete(key);
    }

    keys(index: I): K[] {
        const serializedIndex = this.serialize(index);
        if (!this.map.has(serializedIndex)) {
            return [];
        }

        return Array.from(this.map.get(serializedIndex)!);
    }
}

export default KeySet;