import { ColumnSetting, Index, Order } from "../model/basic";
import { BasicRankAggs, BasicRankAggsAsc, BasicRankAggsDesc } from "./basic";
import { match } from 'ts-pattern';
import { OptimizedRankAggsAsc, OptimizedRankAggsDesc } from "./optimized";
import { IRankAggs } from "./interface";



const migrationThreshold = 32;

class ColumnAggs {
    rankSet: IRankAggs;
    coll: Map<Number, ColumnAggs>

    setting: ColumnSetting;
    idx: Number;

    migrated: boolean = false;

    private initializeRankSet(order: Order): IRankAggs {
        return match<Order, IRankAggs>(order)
            .with('asc', () => new BasicRankAggsAsc())
            .with('desc', () => new BasicRankAggsDesc())
            .exhaustive();
    }

    private migrateRankSet(order: Order): IRankAggs {
        let oldset = this.rankSet as BasicRankAggs;
        let newset = match<Order, IRankAggs>(order)
        .with('asc',  () => new OptimizedRankAggsAsc(this.setting.lRange, this.setting.rRange, oldset.all()))
        .with('desc', () => new OptimizedRankAggsDesc(this.setting.lRange, this.setting.rRange, oldset.all()))
        .exhaustive();
        return newset;
    }

    constructor(index: number, setting: ColumnSetting) {

        this.idx = index;
        this.setting = setting;

        this.rankSet = this.initializeRankSet(setting.order);
        this.coll = new Map();
    }

    index(): Number {
        return this.idx;
    }

    insert(coll: ColumnAggs): void {

        if (this.coll.has(coll.index())) {
            console.log("warning! collumAggs is overrided");
        }

        this.coll.set(coll.index(), coll);

        if (this.migrated === false) {
            if (this.coll.size >= migrationThreshold) {
                this.rankSet = this.migrateRankSet(this.setting.order);
                this.migrated = true;
            }
        }
    }

    next(index: number): (ColumnAggs | null) {
        let coll = this.coll.get(index);
        return coll ? coll : null;
    }

    inc(index: number): void {
        this.rankSet.inc(index);
    }

    dec(index: number): void {
        this.rankSet.dec(index);
    }

    count(index: number): number {
        return this.rankSet.rank(index);
    }

    size(): number {
        return this.coll.size;
    }
}


export default ColumnAggs;