import { IndexFormat } from "../../src/model/basic";
import { AccessPlane, IAccessPlane } from "../../src/set/accessor";




describe("AccessPlane with length 1 index", () => {

    const setting: IndexFormat = [{order: 'asc', min: 0, max: 63}]

    const control: IAccessPlane<string, [number]> = new AccessPlane(setting);

    it("should insert return proper index after insertion", () => {
        control.insert("a", [1]);

        expect(control.keys([1])).toEqual(["a"]);
        expect(control.index("a")).toEqual([1]);

        control.insert("b", [1]);
        expect(control.keys([1]).sort).toEqual(["b", "a"].sort);
        expect(control.index("b")).toEqual([1]);

        control.insert("c", [2]);
        expect(control.keys([2])).toEqual(["c"]);
        expect(control.index("c")).toEqual([2]);
    });

    it("should remove return proper index after removal", () => {
        control.remove("a");
        expect(control.keys([1])).toEqual(["b"]);
        expect(() => control.index("a")).toThrow();
    });

    it("should update return proper index after update", () => {
        control.update("b", [2]);
        expect(control.keys([1])).toEqual([]);
        expect(control.keys([2]).sort).toEqual(["b", "c"].sort);
        expect(control.index("b")).toEqual([2]);
    });

    it("should rank return proper rank", () => {

        control.insert("a", [1]);
        control.insert("d", [5]);

        expect(control.index("a")).toEqual([1]);
        expect(control.index("b")).toEqual([2]);
        expect(control.index("c")).toEqual([2]);
        expect(control.index("d")).toEqual([5]);

        expect(control.rank("a")).toEqual(0);
        expect(control.rank("b")).toEqual(1);
        expect(control.rank("c")).toEqual(1);
        expect(control.rank("d")).toEqual(3);
    });

    it("should keys return proper rank after update", () => {
        control.update("b", [5]);
        expect(control.index("a")).toEqual([1]);
        expect(control.index("b")).toEqual([5]);
        expect(control.index("c")).toEqual([2]);
        expect(control.index("d")).toEqual([5]);

        expect(control.rank("a")).toEqual(0);
        expect(control.rank("b")).toEqual(2);
        expect(control.rank("c")).toEqual(1);
        expect(control.rank("d")).toEqual(2);

        control.remove("d");
        expect(control.index("a")).toEqual([1]);
        expect(control.index("b")).toEqual([5]);
        expect(control.index("c")).toEqual([2]);
        expect(() => control.index("d")).toThrow();

        expect(control.rank("a")).toEqual(0);
        expect(control.rank("b")).toEqual(2);
        expect(control.rank("c")).toEqual(1);
    });
});


describe("AccessPlane with length 3 index", () => {

    const setting: IndexFormat = [
        {order: 'asc', min: 0, max: 63},
        {order: 'desc', min: 0, max: 63},
        {order: 'asc', min: 0, max: 63}
    ];

    const control: IAccessPlane<string, [number, number, number]> = new AccessPlane(setting);

    it("should insert return proper index after insertion", () => {
        control.insert("a", [1, 2, 3]);
        control.insert("b", [5, 7, 2]);
        control.insert("c", [1, 2, 1]);
        control.insert("d", [2, 2, 5]);
        control.insert("e", [3, 2, 7]);
        control.insert("f", [4, 2, 1]);
        control.insert("g", [5, 5, 2]);
        control.insert("h", [6, 2, 7]);
        control.insert("i", [7, 2, 1]);

        expect(control.rank("a")).toEqual(1);
        expect(control.rank("b")).toEqual(5);
        expect(control.rank("c")).toEqual(0);
        expect(control.rank("d")).toEqual(2);
        expect(control.rank("e")).toEqual(3);
        expect(control.rank("f")).toEqual(4);
        expect(control.rank("g")).toEqual(6);
        expect(control.rank("h")).toEqual(7);
        expect(control.rank("i")).toEqual(8);
    });

    it("should return proper rank after update", () => {
        control.remove("e")
        control.update("a", [2, 6, 5]);
        control.update("c", [2, 6, 5]);

        expect(control.rank("a")).toEqual(0);
        expect(control.rank("b")).toEqual(4);
        expect(control.rank("c")).toEqual(0);
        expect(control.rank("d")).toEqual(2);
        expect(control.rank("f")).toEqual(3);
        expect(control.rank("g")).toEqual(5);
        expect(control.rank("h")).toEqual(6);
        expect(control.rank("i")).toEqual(7);
    });
});