import { BasicRankAggs, ColumnAggs, IRankAggs, OptimizedRankAggs } from "../../src/aggregate";



describe('ColumnAggs.migrateRankSet', () => {

    const setting = {
        order: 'asc' as const,
        lRange: 0,
        rRange: 63
    }

    const columnAggs = new ColumnAggs(0, setting);

    const basic = columnAggs.rankSet
    
    for (let i=0; i<1000; i++) {
        const val = Math.floor(Math.random() * (setting.rRange - setting.lRange + 1)) + setting.lRange;
        basic.inc(val);
    }

    const optimized = (columnAggs as any).migrateRankSet(setting.order) as IRankAggs;

    const count = 10000;

    it('should return same result', () => {
        for (let i = 0; i < count; i++) {
            const val = Math.floor(Math.random() * (setting.rRange - setting.lRange + 1)) + setting.lRange;

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


describe('ColumnAggs', () => {

    const setting = {
        order: 'asc' as const,
        lRange: 0,
        rRange: 63
    }

    const columnAggs = new ColumnAggs(0, setting);

    let count = 0;
    const threshold = 32;

    it('should be migrated after insertions exceeding threshold', () => {
        while (count != threshold -1) {
            const val = Math.floor(Math.random() * (setting.rRange - setting.lRange + 1)) + setting.lRange;
            const nxtColl = columnAggs.next(val);
            if (!nxtColl) {
                columnAggs.insert(new ColumnAggs(val, setting));
                count++;
            } else {
                columnAggs.inc(val);
            }
        }
        expect(columnAggs.coll.size).toBe(threshold - 1);
        expect(columnAggs.rankSet).toBeInstanceOf(BasicRankAggs);
        expect(columnAggs.migrated).toBe(false);
        
        while (count != threshold) {
            const val = Math.floor(Math.random() * (setting.rRange - setting.lRange + 1)) + setting.lRange;
            const nxtColl = columnAggs.next(val);
            if (!nxtColl) {
                columnAggs.insert(new ColumnAggs(val, setting));
                count++;
            } else {
                columnAggs.inc(val);
            }
        }
        expect(columnAggs.coll.size).toBe(threshold);
        expect(columnAggs.rankSet).toBeInstanceOf(OptimizedRankAggs);
        expect(columnAggs.migrated).toBe(true);
    }); 
});