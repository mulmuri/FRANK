import TreeNode from "./node";



type Merge<T> = (...numbers: T[]) => T;

class SegmentTree<T extends number> {

    merge: Merge<T>;
    default: T;

    constructor(merge: Merge<T>) {
        this.merge = merge;
        this.default = merge();
    }

    update(node: TreeNode<T>, l: number, r: number, x: number, v: T) {
        if (l === r) {
            node.v = v;
            return;
        }

        let m = (l + r) >> 1;

        if (x <= m) {
            if (!node.l) {
                node.l = new TreeNode<T>(this.default);
            }
            this.update(node.l, l, m, x, v);
        } else {
            if (!node.r) {
                node.r = new TreeNode<T>(this.default);
            }
            this.update(node.r, m + 1, r, x, v);
        }

        let t1 = node.l ? node.l.v : this.default;
        let t2 = node.r ? node.r.v : this.default;

        node.v = this.merge(t1, t2);
    }

    query(node: TreeNode<T>, s: number, e: number, l: number, r: number): T {
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

export default SegmentTree;