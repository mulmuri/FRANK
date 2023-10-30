import IndexSet from "../../src/set/indexset";


describe('IndexSet', () => {

    const set = new IndexSet<string, [number]>();


    it('should get right value of inserted', () => {
        set.insert("a", [1]);
        expect(set.index("a")).toEqual([1]);

        set.insert("a", [2]);
        expect(set.index("a")).toEqual([2]);
    });

    it('suould throw error when update non-exist key', () => {
        expect(() => set.update("b", [3])).toThrowError("Key does not exist.");
    });

    it('should get right value of updated', () => {
        set.update("a", [3]);
        expect(set.index("a")).toEqual([3]);
    });

    it('should get right value of removed', () => {
        set.remove("a");
        expect(set.index("a")).toEqual(null);
    });
});