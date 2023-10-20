import { ColumnAggs } from "../aggregate";
import { Index, IndexFormat, Order } from "../model/basic";



class RankSet<I extends Index> {
    
    rootColl: ColumnAggs;
    indexFormat: IndexFormat;

    constructor(indexFormat: IndexFormat) {
        this.rootColl = new ColumnAggs(indexFormat[0].order, indexFormat[0].min, indexFormat[0].max);
        this.indexFormat = indexFormat;
    }

    inc(index: I): void {
        let curColl = this.rootColl;

        for (const [i, e] of index.entries()) {
            let coll = this.rootColl.inc(e);

            if (!coll) {
                if (i === index.length - 1) {
                    throw new Error("the last coll should not be null");
                }
                continue;
            }

            curColl = coll!;
        }
    }

    dec(index: I): void {
        let curColl = this.rootColl;

        for (const [i, e] of index.entries()) {
            let coll = this.rootColl.dec(e);

            if (!coll) {
                if (i === index.length - 1) {
                    throw new Error("the last coll should not be null");
                }
                continue;
            }

            curColl = coll!;
        }
    }

    rank(index: I): number {
        let curColl = this.rootColl;
        let sum = 0;

        for (const [i, e] of index.entries()) {
            let coll = this.rootColl.dec(e);

            if (!coll) {
                if (i === index.length - 1) {
                    throw new Error("the last coll should not be null");
                }
                continue;
            }
            sum += coll.count(e)

            curColl = coll!;
        }
        return sum;
    }

    exists(index: I): boolean {
        
    }
}

export default RankSet;