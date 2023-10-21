import { DB, UserRepository, IUser, connConfig } from "."

import dotenv from 'dotenv';
dotenv.config();

const connectionConfig: connConfig = {
    host: process.env.DB_HOST || (() => { throw new Error("environment DB_HOST is not set"); })(),
    user: process.env.DB_USER || (() => { throw new Error("environment DB_USER is not set"); })(),
    password: process.env.DB_PASS || (() => { throw new Error("environment DB_PASS is not set"); })(),
    database: process.env.DB_NAME || (() => { throw new Error("environment DB_NAME is not set"); })(),
};



describe("MySQL", () => {

    const db = new DB(connectionConfig);

    const userList: IUser[] = [
        {
            id: "test",
            grade: "A",
            point: 100,
            date: new Date()
        } as IUser,
        {
            id: "frank",
            grade: "B",
            point: 300,
            date: new Date()
        } as IUser,
    ]

    const updatedUser: IUser = {
        id: "test",
        grade: "B",
        point: 200,
        date: new Date()
    } as IUser;


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

        try {
            await conn.beginTransaction();
            for (const user of userList) {
                await userRepository.insertUser(conn, user);
            }
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

        try {
            await conn.beginTransaction();
            await userRepository.updateUser(conn, updatedUser);
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
            const [user, exists] = await userRepository.getUser(conn, updatedUser.id);
            expect(exists).toBe(true);
            expect(user.id).toBe(updatedUser.id);
            expect(user.grade).toBe(updatedUser.grade);
            expect(user.point).toBe(updatedUser.point);
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
            const [rank, exists] = await userRepository.getUserRank(conn, userList[0].id);
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
            for (const user of userList) {
                await userRepository.removeUser(conn, user.id);
            }
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