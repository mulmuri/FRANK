import SegTree from "./segtree_method";


export class SumSegTree extends SegTree {
    constructor(lRange: number, rRange: number) {
        super(lRange, rRange, (...numbers: number[]) => numbers.reduce((a, b) => a + b, 0));
    }
}

export class MaxSegTree extends SegTree {
    constructor(lRange: number, rRange: number) {
        super(lRange, rRange, (...numbers: number[]) => Math.max(...numbers));
    }
}

export class MinSegTree extends SegTree {
    constructor(lRange: number, rRange: number) {
        super(lRange, rRange, (...numbers: number[]) => Math.min(...numbers));
    }
}