import { OptimizedRankAggsAsc, OptimizedRankAggsDesc } from "../../src/aggregate";


describe("OptimizedRankAsc", () => {

    let rankAggs = new OptimizedRankAggsAsc(0, 31);

    it("should be initialized", () => {
        expect(rankAggs.rank(0)).toBe(0);
        expect(rankAggs.rank(1)).toBe(0);
        expect(rankAggs.rank(2)).toBe(0);
    });

    it("should return proper rank after increase", () => {
        rankAggs.inc(1);
        expect(rankAggs.rank(0)).toBe(0);
        expect(rankAggs.rank(1)).toBe(0);
        expect(rankAggs.rank(2)).toBe(1);
        expect(rankAggs.rank(3)).toBe(1);

        rankAggs.inc(2);
        expect(rankAggs.rank(0)).toBe(0);
        expect(rankAggs.rank(1)).toBe(0);
        expect(rankAggs.rank(2)).toBe(1);
        expect(rankAggs.rank(3)).toBe(2);

        expect(rankAggs.exists(1)).toBe(true);
        expect(rankAggs.size()).toBe(2);
    });

    it("should return proper rank after decrease", () => {
        rankAggs.dec(1);
        expect(rankAggs.rank(0)).toBe(0);
        expect(rankAggs.rank(1)).toBe(0);
        expect(rankAggs.rank(2)).toBe(0);
        expect(rankAggs.rank(3)).toBe(1);

        expect(rankAggs.exists(1)).toBe(false);
        expect(rankAggs.size()).toBe(1);
    });
});


describe("OptimizedRankDesc", () => {

    let rankAggs = new OptimizedRankAggsDesc(0, 31);

    it("should be initialized", () => {
        expect(rankAggs.rank(0)).toBe(0);
        expect(rankAggs.rank(1)).toBe(0);
        expect(rankAggs.rank(2)).toBe(0);
    });

    it("should return proper rank after updated", () => {
        rankAggs.inc(1);
        expect(rankAggs.rank(0)).toBe(1);
        expect(rankAggs.rank(1)).toBe(0);
        expect(rankAggs.rank(2)).toBe(0);

        rankAggs.inc(2);
        expect(rankAggs.rank(0)).toBe(2);
        expect(rankAggs.rank(1)).toBe(1);
        expect(rankAggs.rank(2)).toBe(0);
    });

    it("should return proper rank after decrease", () => {
        rankAggs.dec(1);
        expect(rankAggs.rank(0)).toBe(1);
        expect(rankAggs.rank(1)).toBe(1);
        expect(rankAggs.rank(2)).toBe(0);
    });
});



describe("OptimizedRankDesc with initialization", () => {

    const list = new Map<number, number>([
        [1, 1],
        [2, 2],
        [3, 3],
    ]);

    const rankAggs = new OptimizedRankAggsDesc(0, 31, list);

    it('should be initialized by index-value set', () => {

        expect(rankAggs.rank(0)).toBe(6);
        expect(rankAggs.rank(1)).toBe(5);
        expect(rankAggs.rank(2)).toBe(3);
        expect(rankAggs.rank(3)).toBe(0);
    });
});