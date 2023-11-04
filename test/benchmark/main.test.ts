import { DB, UserRepository, IUser, connConfig } from "../mysql"

import dotenv from 'dotenv';
import Random from "../util/random";
import hash from "../util/hash";
import FRANK from "../../src/db/init";
dotenv.config();

const connectionConfig: connConfig = {
    host: process.env.DB_HOST || (() => { throw new Error("environment DB_HOST is not set"); })(),
    user: process.env.DB_USER || (() => { throw new Error("environment DB_USER is not set"); })(),
    database: process.env.DB_NAME || (() => { throw new Error("environment DB_NAME is not set"); })(),
    password: process.env.DB_PASS || "",
};

let db: DB;

beforeAll(async () => {
    db = new DB(connectionConfig);

    const conn = await db.session();

    try {
        await conn.beginTransaction();
        await A.userRepository.setupUserRepository(conn);
        await B.userRepository.setupUserRepository(conn);
        await conn.commit();

    } catch (e) {
        await conn.rollback();
        throw e;

    } finally {
        conn.release();
    }
});

afterAll(async () => {

    const conn = await db.session();

    try {
        await conn.beginTransaction();
        await A.userRepository.teardownUserRepository(conn);
        await B.userRepository.teardownUserRepository(conn);
        await conn.commit();

    } catch (e) {
        await conn.rollback();
        throw e;

    } finally {
        conn.release();
    }

    await db.close();
});


const A = {
    userRepository: new UserRepository("A"),
    random : new Random(),
    userList: [] as IUser[],
    result: [] as number[],
}

const B = {
    userRepository: new UserRepository("B"),
    random: new Random(),
    userList: [] as IUser[],
    result: [] as number[],
    frank: FRANK({
        keyType: 'string',
        valueType: [
            {min: 65, max: 90, order: 'asc'},
            {min: 0, max: 1e9, order: 'desc'},
            {min: 0, max: 1e13, order: 'desc'}
        ]
    })
}


const count = parseInt(process.env.RECORD_COUNT || (() => { throw new Error("environment RECORD_COUNT is not set"); })());
const query = parseInt(process.env.QUERY_COUNT || (() => { throw new Error("environment QUERY_COUNT is not set"); })());
const batchsz = Math.min(parseInt(process.env.RECORD_COUNT || "10000"), 10000);



describe("A: insert query", () => {

    for (let i = 0; i < count; i++) {
        A.userList.push({
            id: A.random.string(10),
            grade: A.random.charUpper(),
            point: A.random.int(0, 1e9),
            date:  A.random.date()
        } as IUser);
    }

    test("insert query", async () => {

        const conn = await db.session();

        try {
            await conn.beginTransaction();
            for (let i = 0; i < count / batchsz; i++) {
                await A.userRepository.insertUserMany(conn, A.userList.slice(i * batchsz, (i + 1) * batchsz));
            }
            await conn.commit();

        } catch (e) {
            await conn.rollback();
            throw e;

        } finally {
            conn.release();
        }
    });

});



describe("B: insert query", () => {
    
    for (let i = 0; i < count; i++) {
        B.userList.push({
            id: B.random.string(10),
            grade: B.random.charUpper(),
            point: B.random.int(0, 1e9),
            date:  B.random.date()
        } as IUser);
    }

    test("insert query", async () => {
    
        const conn = await db.session();
        const sess = B.frank.session();
    
        try {
            await conn.beginTransaction();
            for (let i = 0; i < count / batchsz; i++) {
                await B.userRepository.insertUserMany(conn, B.userList.slice(i * batchsz, (i + 1) * batchsz));
            }
            await conn.commit();

            for (let user of B.userList) {
                await sess.insert(user.id, [user.grade.charCodeAt(0), user.point, user.date.getTime()]);
            }

        } catch (e) {
            await conn.rollback();
            throw e;

        } finally {
            conn.release();
        }
    });
    
});



describe("A: rank query", () => {

    test("rank query", async () => {
        for (let i=0; i<query; i++) {
            const conn = await db.session();

            try {
                await conn.beginTransaction();
                const result = await A.userRepository.getUserRank(conn, A.userList[A.random.int(0, count-1)].id);
                A.result.push(result[0]);
                expect(result[1]).toBe(true);
                await conn.commit();
            } catch (e) {
                await conn.rollback();
                throw e;

            } finally {
                conn.release();
            }
        }
    });

});



describe("B: rank query", () => {

    test("rank query", async () => {
        for (let i=0; i<query; i++) {

            const sess = B.frank.session();
            const result = await sess.rank(B.userList[B.random.int(0, count-1)].id);

            B.result.push(result+1);
        }
    });
});



describe("A: update query", () => {

    test("update query", async () => {
        const conn = await db.session();

        for (let i=0; i<query; i++) {

            try {
                await conn.beginTransaction();
                
                const cases = A.random.int(0, 3);
    
                switch (cases) {
                    case 0:
                        while (true) {
                            const no = A.random.int(0, A.userList.length-1);
                            const userid = A.userList[no].id;
                            if (userid === "") {
                                continue;
                            }
    
                            const user = {
                                id: userid,
                                grade: A.random.charUpper(),
                                point: A.random.int(0, 1e9),
                                date:  A.random.date()
                            } as IUser;
    
                            await A.userRepository.updateUser(conn, user);
                            A.userList[no] = user;
                            break;
                        }
    
                    case 1:
                        const user = {
                            id: A.random.string(10),
                            grade: A.random.charUpper(),
                            point: A.random.int(0, 1e9),
                            date:  A.random.date()
                        } as IUser;
    
                        await A.userRepository.insertUser(conn, user);
                        A.userList.push(user);
    
                    case 2:
                        while (true) {
                            const no = A.random.int(0, A.userList.length-1);
                            const userid = A.userList[no].id;
                            if (userid === "") {
                                continue;
                            }
    
                            await A.userRepository.removeUser(conn, userid);
                            A.userList[no].id = "";
                            break;
                        }
                }
                await conn.commit();
    
            } catch (e) {
                await conn.rollback();
                throw e;
    
            } finally {
                conn.release();
            }
        }
    });
});



describe("B: update query", () => {

    test("update query", async () => {
        const conn = await db.session();

        for (let i=0; i<query; i++) {

            try {
                await conn.beginTransaction();
                const sess = B.frank.session();
                const cases = B.random.int(0, 3);
    
                switch (cases) {
                    case 0:
                        while (true) {
                            const no = B.random.int(0, B.userList.length-1);
                            const userid = B.userList[no].id;
                            if (userid === "") {
                                continue;
                            }
    
                            const user = {
                                id: userid,
                                grade: B.random.charUpper(),
                                point: B.random.int(0, 1e9),
                                date:  B.random.date()
                            } as IUser;
    
                            await B.userRepository.updateUser(conn, user);
                            B.userList[no] = user;
                            sess.update(user.id, [user.grade.charCodeAt(0), user.point, user.date.getTime()]);
                            break;
                        }
    
                    case 1:
                        const user = {
                            id:    B.random.string(10),
                            grade: B.random.charUpper(),
                            point: B.random.int(0, 1e9),
                            date:  B.random.date()
                        } as IUser;
    
                        await B.userRepository.insertUser(conn, user);
                        B.userList.push(user);
                        sess.insert(user.id, [user.grade.charCodeAt(0), user.point, user.date.getTime()]);
    
                    case 2:
                        while (true) {
                            const no = B.random.int(0, B.userList.length-1);
                            const userid = B.userList[no].id;
                            if (userid === "") {
                                continue;
                            }
    
                            await B.userRepository.removeUser(conn, userid);
                            B.userList[no].id = "";
                            sess.remove(userid);
                            break;
                        }
                }
                await conn.commit();
    
            } catch (e) {
                await conn.rollback();
                throw e;
    
            } finally {
                conn.release();
            }
    
        }
    });
});



describe("Compare A & B", () => {

    test("compare input", async () => {

        let strA = A.userList.join("");
        let strB = B.userList.join("");

        expect(hash(strA)).toBe(hash(strB));
    });

    test("compare result", async () => {
        expect(A.result.length).toBe(query);
        expect(B.result.length).toBe(query);
        for (let i=0; i<query; i++) {
            expect(A.result[i]).toBe(B.result[i]);
        }
    });
});