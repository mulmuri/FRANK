class TreeNode<T> {
    l: TreeNode<T> | null = null;
    r: TreeNode<T> | null = null;

    i: number;
    v: T;

    constructor(index: number, value: T) {
        this.i = index;
        this.v = value;
    }
}

export default TreeNode