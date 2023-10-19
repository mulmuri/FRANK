import { SumSegTree } from "../datastructure";


export class OptimizedRankAggs {
    segtree: SumSegTree;
    lRange: number;
    rRange: number;

    sz: number = 0;

    constructor(lRange: number, rRange: number) {
        this.segtree = new SumSegTree(lRange, rRange);
        this.lRange = lRange;
        this.rRange = rRange;
    }

    inc(index: number): void {
        this.segtree.increase(index);
        this.sz++;
    }

    dec(index: number): void {
        this.segtree.decrease(index);
        this.sz--;
    }

    rank(index: number): number {
        return this.segtree.query(this.lRange, index - 1);
    }

    exists(index: number): boolean {
        return this.segtree.query(index, index) > 0;
    }

    size(): number {
        return this.sz;
    }
}

export class OptimizedRankAggsAsc extends OptimizedRankAggs {
    rank(index: number): number {
        return super.rank(index);
    }
}

export class OptimizedRankAggsDesc extends OptimizedRankAggs {
    rank(index: number): number {
        return this.size() - super.rank(index + 1);
    }
}