import SegTree from "./segtree_method";


export class SumSegTree extends SegTree {
    constructor(left: number, right: number) {
        super(left, right, (...numbers: number[]) => numbers.reduce((a, b) => a + b, 0));
    }
}

export class MaxSegTree extends SegTree {
    constructor(left: number, right: number) {
        super(left, right, (...numbers: number[]) => Math.max(...numbers));
    }
}

export class MinSegTree extends SegTree {
    constructor(left: number, right: number) {
        super(left, right, (...numbers: number[]) => Math.min(...numbers));
    }
}