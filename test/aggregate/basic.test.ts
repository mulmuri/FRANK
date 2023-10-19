import { BasicRankAggsAsc, BasicRankAggsDesc } from "../../src/aggregate";


describe("BasicRankAsc", () => {

    let rankAggs = new BasicRankAggsAsc();

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
    });

    it("should return proper rank after decrease", () => {
        rankAggs.dec(1);
        expect(rankAggs.rank(0)).toBe(0);
        expect(rankAggs.rank(1)).toBe(0);
        expect(rankAggs.rank(2)).toBe(0);
        expect(rankAggs.rank(3)).toBe(1);
    });

    it("should throw error when decreasing invalid value", () => {
        expect(() => rankAggs.dec(1)).toThrowError();
        expect(() => rankAggs.dec(3)).toThrowError();
    });
});


describe("BasicRankDesc", () => {

    let rankAggs = new BasicRankAggsDesc();

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

    it("should throw error when decreasing invalid value", () => {
        expect(() => rankAggs.dec(1)).toThrowError();
        expect(() => rankAggs.dec(3)).toThrowError();
    });
});