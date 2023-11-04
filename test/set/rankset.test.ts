import { IndexFormat, IndexSetting } from "../../src/model/basic";
import RankSet from "../../src/set/rankset";


describe("RankSet One Dimensional", () => {

    const setting: IndexSetting = [
        {order: 'asc', lRange: 0, rRange: 63},
    ];

    const rankSet = new RankSet(setting);

    it('should be equal after increase and decrease', () => {
        rankSet.increase([10]);
        expect(rankSet.rank([10])).toBe(0);
        expect(rankSet.rank([12])).toBe(1);

        rankSet.decrease([10]);
        expect(rankSet.rank([10])).toBe(0);
        expect(rankSet.rank([12])).toBe(0);

        rankSet.increase([10]);
        expect(rankSet.rank([10])).toBe(0);
        expect(rankSet.rank([12])).toBe(1);

        rankSet.decrease([10]);
        expect(rankSet.rank([10])).toBe(0);
        expect(rankSet.rank([12])).toBe(0);
    });

    it('should increase properly', () => {
        rankSet.increase([1]); // No. 0
        rankSet.increase([2]); // No. 1
        rankSet.increase([4]); // No. 2
        rankSet.increase([6]); // No. 3

        expect(rankSet.rank([1])).toBe(0);
        expect(rankSet.rank([2])).toBe(1);
        expect(rankSet.rank([4])).toBe(2);
        expect(rankSet.rank([6])).toBe(3);

        expect(rankSet.rank([3])).toBe(2);
        expect(rankSet.rank([8])).toBe(4);
    });

    it('should decrease properly', () => {
        rankSet.decrease([2]);

        expect(rankSet.rank([1])).toBe(0);
        expect(rankSet.rank([2])).toBe(1);
        expect(rankSet.rank([4])).toBe(1);
        expect(rankSet.rank([6])).toBe(2);
        expect(rankSet.rank([8])).toBe(3);
    });
});



describe("RankSet One Dimensional Desending", () => {

    const setting: IndexSetting = [
        {order: 'desc', lRange: 0, rRange: 63},
    ];

    const rankSet = new RankSet(setting);

    it('should increase properly', () => {
        rankSet.increase([1]); // No. 3
        rankSet.increase([2]); // No. 2
        rankSet.increase([3]); // No. 1
        rankSet.increase([4]); // No. 0

        expect(rankSet.rank([1])).toBe(3);
        expect(rankSet.rank([2])).toBe(2);
        expect(rankSet.rank([3])).toBe(1);
        expect(rankSet.rank([4])).toBe(0);
    });

    it('should decrease properly', () => {
        rankSet.decrease([2]);

        expect(rankSet.rank([1])).toBe(2);
        expect(rankSet.rank([2])).toBe(2);
        expect(rankSet.rank([3])).toBe(1);
        expect(rankSet.rank([4])).toBe(0);
    });
});


describe("RankSet Two Dimensional Ascending", () => {

    const setting: IndexSetting = [
        {order: 'asc', lRange: 0, rRange: 63},
        {order: 'asc', lRange: 0, rRange: 63},
    ]

    const rankSet = new RankSet(setting);

    it('should increase properly', () => {
        rankSet.increase([1, 2]); // No. 0
        rankSet.increase([1, 3]); // No. 1
        rankSet.increase([2, 2]); // No. 2
        rankSet.increase([2, 3]); // No. 3

        expect(rankSet.rank([1, 2])).toBe(0);
        expect(rankSet.rank([1, 3])).toBe(1);
        expect(rankSet.rank([2, 2])).toBe(2);
        expect(rankSet.rank([2, 3])).toBe(3);

        expect(rankSet.rank([2, 1])).toBe(2);
        expect(rankSet.rank([2, 4])).toBe(4);
    });

    it('should decrease properly', () => {
        rankSet.decrease([1,3]);

        expect(rankSet.rank([1, 2])).toBe(0);
        expect(rankSet.rank([1, 3])).toBe(1);
        expect(rankSet.rank([2, 2])).toBe(1);
        expect(rankSet.rank([2, 3])).toBe(2);
    });
});



describe("RankSet Two Dimensional Descending", () => {

    const setting: IndexSetting = [
        {order: 'desc', lRange: 0, rRange: 63},
        {order: 'desc', lRange: 0, rRange: 63},
    ]

    const rankSet = new RankSet(setting);

    it('should increase properly', () => {
        rankSet.increase([1, 2]); // No. 3
        rankSet.increase([1, 3]); // No. 2
        rankSet.increase([2, 2]); // No. 1
        rankSet.increase([2, 3]); // No. 0

        expect(rankSet.rank([1, 2])).toBe(3);
        expect(rankSet.rank([1, 3])).toBe(2);
        expect(rankSet.rank([2, 2])).toBe(1);
        expect(rankSet.rank([2, 3])).toBe(0);

        expect(rankSet.rank([1, 1])).toBe(4);
        expect(rankSet.rank([1, 4])).toBe(2);
    });

    it('should decrease properly', () => {
        rankSet.decrease([1,3]);

        expect(rankSet.rank([1, 2])).toBe(2);
        expect(rankSet.rank([1, 3])).toBe(2);
        expect(rankSet.rank([2, 2])).toBe(1);
        expect(rankSet.rank([2, 3])).toBe(0);
    });
});


describe("RankSet Two Dimensional Compounded", () => {

    const setting: IndexSetting = [
        {order: 'asc', lRange: 0, rRange: 63},
        {order: 'desc', lRange: 0, rRange: 63},
    ]

    const rankSet = new RankSet(setting);

    it('should increase properly', () => {
        rankSet.increase([1, 2]); // No. 1
        rankSet.increase([1, 3]); // No. 0
        rankSet.increase([2, 2]); // No. 3
        rankSet.increase([2, 3]); // No. 2

        expect(rankSet.rank([1, 2])).toBe(1);
        expect(rankSet.rank([1, 3])).toBe(0);
        expect(rankSet.rank([2, 2])).toBe(3);
        expect(rankSet.rank([2, 3])).toBe(2);

        expect(rankSet.rank([2, 1])).toBe(4);
        expect(rankSet.rank([2, 4])).toBe(2);
    });

    it('should decrease properly', () => {
        rankSet.decrease([1,3]);

        expect(rankSet.rank([1, 2])).toBe(0);
        expect(rankSet.rank([1, 3])).toBe(0);
        expect(rankSet.rank([2, 2])).toBe(2);
        expect(rankSet.rank([2, 3])).toBe(1);
    });

});


