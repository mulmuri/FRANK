import { Order } from "../model/basic";
import { BasicRankAggs, BasicRankAggsAsc, BasicRankAggsDesc } from "./basic";
import { match } from 'ts-pattern';
import { OptimizedRankAggsAsc, OptimizedRankAggsDesc } from "./optimized";
import { IRankAggs } from "./interface";



class ColumnAggs {
    rankSet: IRankAggs;
    coll: Map<number, ColumnAggs | null>

    order: Order;
    lRange: number;
    rRange: number;

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
        return this.rankSet.exists(index);
    }

    insert(index: number, colset: ColumnAggs): void {
        this.rankSet.inc(index);

        if (this.rankSet instanceof BasicRankAggs) {
            if (this.rankSet.size() > 30) {
                this.rankSet = this.migrateRankSet(this.order);
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