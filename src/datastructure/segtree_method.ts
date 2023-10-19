import TreeNode from "./treenode";

type Merge = (...numbers: number[]) => number;

class SegmentTreeMethod {

    merge: Merge;
    default: number;

    constructor(merge: Merge) {
        this.merge = merge;
        this.default = merge();
    }

    update(node: TreeNode, l: number, r: number, x: number, v: number) {
        if (l === r) {
            node.v = v;
            return;
        }

        let m = (l + r) >> 1;

        if (x <= m) {
            if (!node.l) {
                node.l = new TreeNode(this.default);
            }
            this.update(node.l, l, m, x, v);
        } else {
            if (!node.r) {
                node.r = new TreeNode(this.default);
            }
            this.update(node.r, m + 1, r, x, v);
        }

        let t1 = node.l ? node.l.v : this.default;
        let t2 = node.r ? node.r.v : this.default;

        node.v = this.merge(t1, t2);
    }



    increase(node: TreeNode, l: number, r: number, x: number) {
        if (l === r) {
            node.v++;
            return;
        }

        let m = (l + r) >> 1;

        if (x <= m) {
            if (!node.l) {
                node.l = new TreeNode(this.default);
            }
            this.increase(node.l, l, m, x);
        } else {
            if (!node.r) {
                node.r = new TreeNode(this.default);
            }
            this.increase(node.r, m + 1, r, x);
        }

        let t1 = node.l ? node.l.v : this.default;
        let t2 = node.r ? node.r.v : this.default;

        node.v = this.merge(t1, t2);
    }


    decrease(node: TreeNode, l: number, r: number, x: number) {
        if (l === r) {
            node.v--;
            return;
        }

        let m = (l + r) >> 1;

        if (x <= m) {
            if (!node.l) {
                node.l = new TreeNode(this.default);
            }
            this.decrease(node.l, l, m, x);
        } else {
            if (!node.r) {
                node.r = new TreeNode(this.default);
            }
            this.decrease(node.r, m + 1, r, x);
        }

        let t1 = node.l ? node.l.v : this.default;
        let t2 = node.r ? node.r.v : this.default;

        node.v = this.merge(t1, t2);
    }



    query(node: TreeNode, s: number, e: number, l: number, r: number): number {
        if (r < s || e < l) {
            return this.default;
        }
        if (l <= s && e <= r) {
            return node.v;
        }

        let m = (l + r) >> 1;
        let t1 = node.l ? this.query(node.l, s, m, l, r)     : this.default;
        let t2 = node.r ? this.query(node.r, m + 1, e, l, r) : this.default;
        return this.merge(t1, t2);
    }
}



class SegTree {
    segTree: SegmentTreeMethod;

    root: TreeNode;

    left: number;
    right: number;

    constructor(left: number, right: number, merge: (...numbers: number[]) => number) {
        this.segTree = new SegmentTreeMethod(merge);

        this.root = new TreeNode(this.segTree.default);

        this.left = left;
        this.right = right;
    }

    update(index: number, value: number): void {
        this.segTree.update(this.root, this.left, this.right, index, value);
    }

    increase(index: number): void {
        this.segTree.increase(this.root, this.left, this.right, index);
    }

    decrease(index: number): void {
        this.segTree.decrease(this.root, this.left, this.right, index);
    }

    query(s: number, e: number): number {
        return this.segTree.query(this.root, this.left, this.right, s, e);
    }
}

export default SegTree;