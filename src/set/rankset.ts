import { ColumnAggs } from "../aggregate";
import { Index, ColumnSetting, IndexSetting } from "../model/basic";



class RankSet<I extends Index> {
    
    rootColl: ColumnAggs;
    indexSetting: IndexSetting;

    constructor(indexSetting: IndexSetting) {
        this.rootColl = new ColumnAggs(0, indexSetting[0])
        this.indexSetting = indexSetting;
    }

    increase(index: I): void {
        let curColl = this.rootColl;

        for (const [i, element] of index.entries()) {

            let nxtColl = curColl.next(element);

            if (!nxtColl) {
                if (i !== this.indexSetting.length - 1) {
                    nxtColl = new ColumnAggs(element, this.indexSetting[i+1]);
                    curColl.insert(nxtColl);
                }
            }

            curColl.inc(element);

            curColl = nxtColl!;
        }
    }

    decrease(index: I): void {
        let curColl = this.rootColl;

        for (const [i, element] of index.entries()) {

            let nxtColl = curColl.next(element);

            curColl.dec(element);

            curColl = nxtColl!;
        };
    }

    rank(index: I): number {
        let curColl = this.rootColl;
        let sum = 0;

        for (const element of index) {
            sum += curColl.count(element);

            let nxtColl = curColl.next(element);
            if (!nxtColl) {
                continue;
            }

            curColl = nxtColl;
        }
        return sum;
    }

}

export default RankSet;