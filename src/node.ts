class TreeNode<T> {
    l: TreeNode<T> | null = null;
    r: TreeNode<T> | null = null;

    v: T;

    constructor(value: T) {
        this.v = value;
    }
}

export default TreeNode