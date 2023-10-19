import { Order } from "../model/basic";
import { BasicRankAggs, BasicRankAggsAsc, BasicRankAggsDesc } from "./basic";
import { match } from 'ts-pattern';
import { OptimizedRankAggsAsc, OptimizedRankAggsDesc } from "./optimized";
import { IRankAggs } from "./interface";



const migrationThreshold = 32;

class ColumnAggs {
    rankSet: IRankAggs;
    coll: Map<number, ColumnAggs | null>

    order: Order;
    lRange: number;
    rRange: number;
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
        .with('asc',  () => new OptimizedRankAggsAsc(this.lRange, this.rRange, oldset.all()))
        .with('desc', () => new OptimizedRankAggsDesc(this.lRange, this.rRange, oldset.all()))
        .exhaustive();
        return newset;
    }

    constructor(order: Order, lRange: number, rRange: number) {
        this.rankSet = this.initializeRankSet(order);
        this.coll = new Map();
        this.order = order;
        this.lRange = lRange;
        this.rRange = rRange;
    }

    exists(index: number): boolean {
        return this.coll.has(index);
    }

    insert(index: number, colset: ColumnAggs): void {
        if (this.coll.has(index)) {
            throw new Error("Cannot insert a duplicate value");
        }
        this.coll.set(index, colset);
        this.rankSet.inc(index);

        if (this.migrated === false) {
            if (this.coll.size >= migrationThreshold) {
                this.rankSet = this.migrateRankSet(this.order);
                this.migrated = true;
            }
        }
    }

    inc(index: number): ColumnAggs | null {
        this.rankSet.inc(index);
        return this.coll.get(index) ?? null;
    }

    dec(index: number): ColumnAggs | null {
        this.rankSet.dec(index);
        return this.coll.get(index) ?? null;
    }

    count(index: number): number {
        return this.rankSet.rank(index);
    }
}


export default ColumnAggs;