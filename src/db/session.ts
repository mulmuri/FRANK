import { Mutex } from 'async-mutex';
import { IAccessPlane } from '../set/accessor';
import { Index, Key } from '../model/basic';



export interface ISession<K extends Key, I extends Index> {
    insert(key: K, index: I): Promise<void>;
    remove(key: K): Promise<void>;
    update(key: K, index: I): Promise<void>;
    get(key: K): Promise<I>;
    exists(key: K): Promise<boolean>;
    rank(key: K): Promise<number>;
}


export class Session<K extends Key, I extends Index> {

    mutex: Mutex;
    accessor: IAccessPlane<K,I>;

    constructor(acccessor: IAccessPlane<K,I>, mutex: Mutex) {
        this.accessor = acccessor;
        this.mutex = mutex;
    }

    async insert(key: K, index: I): Promise<void> {
        await this.mutex.runExclusive(async () => {
            this.accessor.insert(key, index);
        });
    }

    async remove(key: K): Promise<void> {
        await this.mutex.runExclusive(async () => {
            this.accessor.remove(key);
        });
    }

    async update(key: K, index: I): Promise<void> {
        await this.mutex.runExclusive(async () => {
            this.accessor.update(key, index);
        });
    }

    async get(key: K): Promise<I> {
        return await this.mutex.runExclusive(async () => {
            return this.accessor.index(key);
        });
    }

    async exists(key: K): Promise<boolean> {
        return await this.mutex.runExclusive(async () => {
            return this.accessor.exists(key);
        });
    }

    async rank(key: K): Promise<number> {
        return await this.mutex.runExclusive(async () => {
            return this.accessor.rank(key);
        });
    }
}