import { DB, UserRepository, IUser, connConfig } from "../mysql"

import dotenv from 'dotenv';
import Random from "../util/random";
dotenv.config();

const connectionConfig: connConfig = {
    host: process.env.DB_HOST || (() => { throw new Error("environment DB_HOST is not set"); })(),
    user: process.env.DB_USER || (() => { throw new Error("environment DB_USER is not set"); })(),
    password: process.env.DB_PASS || (() => { throw new Error("environment DB_PASS is not set"); })(),
    database: process.env.DB_NAME || (() => { throw new Error("environment DB_NAME is not set"); })(),
};


describe("TEST", () => {

    const db = new DB(connectionConfig);

    const userRepository = new UserRepository("OnlyMySQL");

    const random = new Random();

    const userList: IUser[] = [];
    const count = 10000;

    for (let i = 0; i < count; i++) {
        userList.push({
            id: random.string(10),
            grade: random.string(1),
            point: random.int(0, 1e9),
            date: new Date()
        } as IUser);
    }

    it("should create table", async () => {
        const conn = await db.session();

        try {
            await conn.beginTransaction();
            await userRepository.setupUserRepository(conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);

        } finally {
            conn.release();
        }
    });

    test("should insert 1m user", async () => {
        const conn = await db.session();

        try {
            await conn.beginTransaction();

            // divide userList into 1000 and insert
            for (let i = 0; i < 100; i++) {
                await userRepository.insertUserMany(conn, userList.slice(i * 100, (i + 1) * 100));
            }
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);
        } finally {
            conn.release();
        }        
    }, 24 * 60 * 1000);

    test("should query rank and update user taking turn", async () => {

        for (let i = 0; i < 100; i++) {
            const conn = await db.session();

            try {
                await conn.beginTransaction();
                const rank = await userRepository.getUserRank(conn, userList[random.int(0, count)-1].id);
                await userRepository.updateUser(conn, {
                    id: userList[random.int(0, count)-1].id,
                    grade: random.string(1),
                    point: random.int(0, 1e9),
                    date: new Date()
                } as IUser);
                await conn.commit();
            } catch (e) {
                await conn.rollback();
                expect(e).toBe(null);
            } finally {
                conn.release();
            }
        }
    }, 24 * 60 * 1000);

    it('should drop table', async () => {
        const conn = await db.session();

        try {
            await conn.beginTransaction();
            await userRepository.teardownUserRepository(conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);
        } finally {
            conn.release();
        }
    });
});