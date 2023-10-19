import { MaxSegTree, MinSegTree, SumSegTree } from "../../src/datastructure";



describe("MaxSegTree", () => {
    let segTree = new MaxSegTree(0, 31);

    it("should be initialized", () => {
        expect(segTree.query(0, 31)).toBe(-Infinity);
    });

    it("should return non initialized value after upated", () => {
        segTree.update(3, 1);
        expect(segTree.query(0, 31)).toBe(1);
        expect(segTree.query(3, 3)).toBe(1);
        expect(segTree.query(3, 4)).toBe(1);
        expect(segTree.query(4, 4)).toBe(-Infinity);
    });
});



describe("MinSegTree", () => {
    let segTree = new MinSegTree(0, 31);

    it("should be initialized", () => {
        expect(segTree.query(0, 31)).toBe(Infinity);
    });

    it("should return non initialized value after upated", () => {
        segTree.update(0, 1);
        expect(segTree.query(0, 31)).toBe(1);
        expect(segTree.query(15, 31)).toBe(Infinity);
        segTree.update(1, 3);
        expect(segTree.query(0, 31)).toBe(1);
        segTree.update(2, 2);
        expect(segTree.query(0, 31)).toBe(1);
    });
});



describe("SumSegTree", () => {
    let segTree = new SumSegTree(0, 31);

    it("should be initialized", () => {
        expect(segTree.query(0, 31)).toBe(0);
    });

    it("should return non initialized value after upated", () => {
        segTree.update(0, 1);
        expect(segTree.query(0, 0)).toBe(1);
        expect(segTree.query(0, 1)).toBe(1);
        expect(segTree.query(0, 31)).toBe(1);
        expect(segTree.query(15, 31)).toBe(0);

        segTree.update(1, 3);
        expect(segTree.query(1, 2)).toBe(3);
        expect(segTree.query(1, 1)).toBe(3);
        expect(segTree.query(0, 31)).toBe(4);

        segTree.update(2, 2);
        expect(segTree.query(2, 2)).toBe(2);
        expect(segTree.query(0, 31)).toBe(6);
    });
});