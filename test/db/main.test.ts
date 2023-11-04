import FRANK from "../../src/db/init"



describe("size 1 value type", () => {

    const db = FRANK({
        keyType: 'string',
        valueType: [
            {min: 0, max: 1e13, order: 'desc'},
        ]
    })

    const dataList = [
        {id: "A", point: 1381212412, rank: 1},
        {id: "B", point: 4112412323, rank: 0},
        {id: "C", point: 341343,     rank: 4},
        {id: "D", point: 1221343,    rank: 3},
        {id: "E", point: 1223523143, rank: 2},
    ];

    const sess = db.session()

    it("should insert", async () => {
        for (let data of dataList) {
            await sess.insert(data.id, [data.point])
        }
    })

    it("should return proper rank", async () => {
        for (let data of dataList) {
            const rank = await sess.rank(data.id)
            const index = await sess.get(data.id)
            expect(rank).toBe(data.rank)
            expect(index).toEqual([data.point])
        }
    });

    it("should update and delete", async () => {
        await sess.update("A", [12342315])
        await sess.remove("B")
        await sess.remove("C")
        await sess.update("D", [623432])
        await sess.update("E", [213124])

        expect(await sess.rank("A")).toBe(0)
        expect(await sess.rank("D")).toBe(1)
        expect(await sess.rank("E")).toBe(2)

        expect(await sess.exists("A")).toBe(true)
        expect(await sess.exists("B")).toBe(false)
        expect(await sess.exists("C")).toBe(false)
        expect(await sess.exists("D")).toBe(true)
        expect(await sess.exists("E")).toBe(true)
    });
});




describe("size 2 value type", () => {

    const db = FRANK({
        keyType: 'string',
        valueType: [
            {min: 0, max: 65535, order: 'asc'},
            {min: 0, max: 1e9, order: 'desc'},
        ]
    })

    const dataList = [
        { id: "IM6dNlaPlq", grade: "D", point: 504415490, rank: 0 },
        { id: "QRUCrxn0Gm", grade: "F", point: 616935932, rank: 1 },
        { id: "tmblZR6roZ", grade: "H", point: 869737787, rank: 2 },
        { id: "fqj-2_VYW7", grade: "M", point: 95107365,  rank: 3 },
        { id: "XFLF58zuTq", grade: "P", point: 960244550, rank: 4 },
        { id: "4Sg4wSAtVX", grade: "S", point: 847486036, rank: 5 },
        { id: "UILTMhKdfU", grade: "V", point: 138939382, rank: 6 },
        { id: "AERES8A264", grade: "W", point: 90933722,  rank: 7 },
        { id: "VtM1m0y5pX", grade: "X", point: 646980841, rank: 8 },
        { id: "02VpIkCesN", grade: "Z", point: 849701684, rank: 9 }
    ];

    const sess = db.session()

    it("should insert", async () => {
        for (let data of dataList) {
            await sess.insert(data.id, [data.grade.charCodeAt(0), data.point])
        }
    })

    it("should result proper rank", async () => {
        for (let data of dataList) {
            const rank = await sess.rank(data.id)
            const index = await sess.get(data.id)
            expect(rank).toBe(data.rank)
            expect(index).toEqual([data.grade.charCodeAt(0), data.point])
        }
    });
})