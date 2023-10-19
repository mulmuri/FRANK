export class BasicRankAggs {
    set: Map<number, number>;

    constructor() {
        this.set = new Map();
    }

    inc(index: number): void {
        if (!this.set.has(index)) {
            this.set.set(index, 1);
        }
        this.set.set(index, this.set.get(index)! + 1);
    }

    dec(index: number): void {
        if (!this.set.has(index)) {
            this.set.set(index, 0);
        }
        this.set.set(index, this.set.get(index)! - 1);
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
        return this.set.has(index);
    }

    size(): number {
        return this.set.size;
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
        return this.size() - super.rank(index) - 1;
    }
}