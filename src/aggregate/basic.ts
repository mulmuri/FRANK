export class BasicRankAggs {
    set: Map<number, number>;
    sz: number = 0;

    constructor(set?: Map<number, number>) {
        this.set = new Map();
        if (set) {
            for (let [key, value] of set || new Map()) {
                this.set.set(key, value);
                this.sz += value;
            }
        }
    }

    inc(index: number): void {
        if (!this.set.has(index)) {
            this.set.set(index, 1);
        } else {
            this.set.set(index, this.set.get(index)! + 1);
        }
        this.sz++;
    }

    dec(index: number): void {
        if (!this.set.has(index)) {
            this.set.set(index, 0);
        }
        this.set.set(index, this.set.get(index)! - 1);

        this.sz--;
    }

    rank(index: number): number {
        let count = 0;
        for (let [key, value] of this.set) {
            if (key < index) {
                count += value;
            }
        }
        return count;
    }

    exists(index: number): boolean {
        return this.set.has(index) && this.set.get(index)! > 0;
    }

    size(): number {
        return this.sz;
    }

    all(): Map<number, number> {
        return this.set;
    }
}

export class BasicRankAggsAsc extends BasicRankAggs {
    rank(index: number): number {
        return super.rank(index);
    }
}

export class BasicRankAggsDesc extends BasicRankAggs {
    rank(index: number): number {
        return this.size() - super.rank(index+1);
    }
}