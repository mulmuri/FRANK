import { IndexFormat } from "../model/basic";
import { KeyMapping, ToNumberArray } from "../model/util";
import DB from "./db";


const FRANK = <K extends keyof KeyMapping, V extends IndexFormat>({keyType, valueType}: {keyType?: K, valueType: V}): DB<KeyMapping[K], ToNumberArray<V>> => {
    if (keyType === undefined) {
        return new DB<any, ToNumberArray<V>>(valueType);
    }
    return new DB<KeyMapping[K], ToNumberArray<V>>(valueType);
}

export default FRANK;