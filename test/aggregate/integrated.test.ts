import { BasicRankAggsAsc, BasicRankAggsDesc, OptimizedRankAggsAsc, OptimizedRankAggsDesc } from "../../src/aggregate";

describe('basic and optimized rankaggs consistency test for asc', () => {

    const lRange = 0;
    const rRange = 255;

    let basic = new BasicRankAggsAsc();
    let optimized = new OptimizedRankAggsAsc(lRange, rRange);

    const count = 10000;

    it('should be consistent within result between BasicRankAsc and OptimizedRankAsc', () => {

        for (let i = 0; i < count; i++) {
            const val = Math.floor(Math.random() * (rRange - lRange + 1)) + lRange;

            const choice = Math.floor(Math.random() * 3);

            switch (choice) {
                case 0:
                    basic.inc(val);
                    optimized.inc(val);
                    break;
                case 1:
                    expect(basic.exists(val)).toBe(optimized.exists(val));
                    if (basic.exists(val)) {
                        basic.dec(val);
                        optimized.dec(val);
                    }
                    break;
                case 2:
                    expect(basic.rank(val)).toBe(optimized.rank(val));
                    break;
            }
        }
    });
});



describe('basic and optimized rankaggs consistency test for desc', () => {

    const lRange = 0;
    const rRange = 255;

    let basic = new BasicRankAggsDesc();
    let optimized = new OptimizedRankAggsDesc(lRange, rRange);

    const count = 10000;

    it('should be consistent within result between BasicRankDesc and OptimizedRankDesc', () => {

        for (let i = 0; i < count; i++) {
            const val = Math.floor(Math.random() * (rRange - lRange + 1)) + lRange;

            const choice = Math.floor(Math.random() * 3);

            switch (choice) {
                case 0:
                    basic.inc(val);
                    optimized.inc(val);
                    break;
                case 1:
                    expect(basic.exists(val)).toBe(optimized.exists(val));
                    if (basic.exists(val)) {
                        basic.dec(val);
                        optimized.dec(val);
                    }
                    break;
                case 2:
                    expect(basic.rank(val)).toBe(optimized.rank(val));
                    break;
            }
        }
    });
});