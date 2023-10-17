import SegTree from "./segtree_method";


class SumSegTree extends SegTree {
    constructor(left: number, right: number) {
        super(left, right, (a, b) => a + b);
    }
}

class MaxSegTree extends SegTree {
    constructor(left: number, right: number) {
        super(left, right, (a, b) => Math.max(a, b));
    }
}

class MinSegTree extends SegTree {
    constructor(left: number, right: number) {
        super(left, right, (a, b) => Math.min(a, b));
    }
}