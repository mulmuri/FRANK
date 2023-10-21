import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';



export interface IUser extends RowDataPacket {
    id: string;
    grade: string;
    point: number;
    date: Date;
}

export interface RankResult extends RowDataPacket {
    ranking: number;
}



class UserRepository {

    async setupUserRepository(conn: Connection): Promise<void> {
        await conn.query<ResultSetHeader>(
            `CREATE TABLE IF NOT EXISTS User (
                id    VARCHAR(16)  NOT NULL PRIMARY KEY,
                grade VARCHAR(1)   NOT NULL,
                point INT          NOT NULL,
                date  DATETIME     NOT NULL,
                INDEX idx_user_ranking (grade, point DESC, date DESC)
            )`
        );
    }

    async teardownUserRepository(conn: Connection): Promise<void> {
        await conn.query<ResultSetHeader>(
            `DROP TABLE IF EXISTS User`
        );
    }

    async insertUser(conn: Connection, user: IUser): Promise<void> {
        await conn.query<ResultSetHeader>(
            `INSERT INTO User (id, grade, point, date) VALUES (?, ?, ?, ?)`,
            [user.id, user.grade, user.point, user.date]
        );
    }

    async insertUserMany(conn: Connection, userList: IUser[]): Promise<void> {
        await conn.query<ResultSetHeader>(
            `INSERT INTO User (id, grade, point, date) VALUES ?`,
            [userList.map(user => [user.id, user.grade, user.point, user.date])]
        );
    }

    async removeUser(conn: Connection, id: string): Promise<void> {
        await conn.query<ResultSetHeader>(
            `DELETE FROM User WHERE id = ?`,
            [id]
        );
    }

    async updateUser(conn: Connection, user: IUser): Promise<void> {
        await conn.query<ResultSetHeader>(
            `UPDATE User SET grade = ?, point = ?, date = ? WHERE id = ?`,
            [user.grade, user.point, user.date, user.id]
        );
    }

    async getUser(conn: Connection, id: string): Promise<[IUser, boolean]> {
        const [rows] = await conn.query<IUser[]>(
            `SELECT * FROM User WHERE id = ?`,
            [id]
        );
        return rows.length ? [rows[0], true] : [rows[0], false];
    }

    async getUserRank(conn: Connection, id: string): Promise<[number, boolean]> {
        const [rows] = await conn.query<RankResult[]>(
            `SELECT RANK() OVER (ORDER BY grade ASC, point DESC, date DESC) AS ranking FROM User WHERE id = ?`,
            [id]
        );
        if (rows.length && rows[0].ranking !== undefined) {
            return [rows[0].ranking, true];
        }
        return [-1, false];
    }
}


export default UserRepository;