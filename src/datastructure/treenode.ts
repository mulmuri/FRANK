class TreeNode {
    l: TreeNode | null = null;
    r: TreeNode | null = null;

    v: number;

    constructor(value: number) {
        this.v = value;
    }
}

export default TreeNode;