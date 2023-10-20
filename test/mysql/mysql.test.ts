import { DB, UserRepository, IUser, connConfig } from "."

import dotenv from 'dotenv';
dotenv.config();

const connectionConfig: connConfig = {
    host: process.env.DB_HOST || (() => { throw new Error("DB_HOST is not set"); })(),
    user: process.env.DB_USER || (() => { throw new Error("DB_USER is not set"); })(),
    password: process.env.DB_PASS || (() => { throw new Error("DB_PASS is not set"); })(),
    database: process.env.DB_NAME || (() => { throw new Error("DB_NAME is not set"); })(),
};



describe("MySQL", () => {

    const db = new DB(connectionConfig);

    const userRepository = new UserRepository();

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

    it("should insert user", async () => {
        const conn = await db.session();

        const user: IUser = {
            id: "test",
            grade: "A",
            point: 100,
            date: new Date()
        } as IUser;

        try {
            await conn.beginTransaction();
            await userRepository.insertUser(conn, user);
            await conn.commit();

        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);

        } finally {
            conn.release();
        }
    });

    it("should update user", async () => {
        const conn = await db.session();

        const user: IUser = {
            id: "test",
            grade: "B",
            point: 200,
            date: new Date()
        } as IUser;

        try {
            await conn.beginTransaction();
            await userRepository.updateUser(conn, user);
            await conn.commit();

        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);

        } finally {
            conn.release();
        }
    });

    it("should get user", async () => {
        const conn = await db.session();

        try {
            await conn.beginTransaction();
            const [user, exists] = await userRepository.getUser(conn, "test");
            expect(exists).toBe(true);
            expect(user.id).toBe("test");
            expect(user.grade).toBe("B");
            expect(user.point).toBe(200);
            await conn.commit();

        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);

        } finally {
            conn.release();
        }
    });

    it("should get ranking", async () => {
        const conn = await db.session();

        try {
            await conn.beginTransaction();
            const [rank, exists] = await userRepository.getUserRank(conn, "test");
            expect(exists).toBe(true);
            expect(rank).toBe(1);
            await conn.commit();

        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);

        } finally {
            conn.release();
        }
    });

    it("should remove user", async () => {
        const conn = await db.session();

        try {
            await conn.beginTransaction();
            await userRepository.removeUser(conn, "test");
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            expect(e).toBe(null);

        } finally {
            conn.release();
        }
    });

    it("should drop table", async () => {
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