import { Key, Index, IndexFormat} from "../model/basic";
import Session, { ISession } from "./session";
import { AccessPlane, IAccessPlane } from "../set/accessor";
import { Mutex } from 'async-mutex';


class DB<K extends Key, I extends Index> {
    indexFormat: IndexFormat;
    AccessPlane: IAccessPlane<K, I>;
    mutex: Mutex = new Mutex();

    constructor(indexFormat: IndexFormat) {
        this.indexFormat = indexFormat;
        this.AccessPlane = new AccessPlane(indexFormat);
    }

    session(): ISession<K, I> {
        return new Session<K, I>(this.AccessPlane, this.mutex);
    }
}

export default DB;