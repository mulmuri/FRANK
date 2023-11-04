
import { createPool, Pool, PoolConnection } from "mysql2/promise";



export type connConfig = {
    host: string;
    user: string;
    password: string;
    database: string;
}



class DB {

    pool: Pool;

    constructor({ host, user, password, database }: connConfig) {
        this.pool = createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
        
    async session(): Promise<PoolConnection> {
        return this.pool.getConnection();
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}

export default DB;