import KeySet from "../../src/set/keyset";




describe("KeySet", () => {

    const set = new KeySet<string, [number]>();

    it("should get right value of inserted", () => {
        set.insert("a", [1]);

        expect(set.keys([1])).toEqual(["a"]);

        set.insert("a", [2]);
        expect(set.keys([2])).toEqual(["a"]);

        set.insert("b", [2]);
        expect(set.keys([2])).toEqual(["a", "b"]);
    });

    it("should get right value of removed", () => {
        set.remove("a", [2]);
        expect(set.keys([2])).toEqual(["b"]);

        set.remove("b", [2]);
        expect(set.keys([2])).toEqual([]);
    });

});



describe("KeySet with two dim", () => {

    const set = new KeySet<string, [number, number]>();

    it("should get right value of inserted", () => {
        set.insert("a", [1, 1]);
        expect(set.keys([1, 1])).toEqual(["a"]);

        set.insert("a", [2, 2]);
        expect(set.keys([2, 2])).toEqual(["a"]);

        set.insert("b", [2, 2]);
        expect(set.keys([2, 2])).toEqual(["a", "b"]);
    });

    it("should get right value of removed", () => {
        set.remove("a", [2, 2]);
        expect(set.keys([2, 2])).toEqual(["b"]);

        set.remove("b", [2, 2]);
        expect(set.keys([2, 2])).toEqual([]);
    });



});