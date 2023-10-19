import { BasicRankAggs, ColumnAggs, IRankAggs } from "../../src/aggregate";



describe('ColumnAggs.migrateRankSet', () => {

    const lRange = 0;
    const rRange = 63;
    const order = 'asc' as const;

    let columnAggs = new ColumnAggs(order, lRange, rRange);

    let basic = columnAggs.rankSet
    
    for (let i=0; i<1000; i++) {
        const val = Math.floor(Math.random() * (rRange - lRange + 1)) + lRange;
        basic.inc(val);
        console.log((basic as BasicRankAggs).all());
    }

    let optimized = (columnAggs as any).migrateRankSet(order) as IRankAggs;

    const count = 10000;

    it('should return same result', () => {
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