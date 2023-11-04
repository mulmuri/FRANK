import FRANK from "../../src/db/init";


describe("race condition problem should be avoided", () => {

    const db = FRANK({
        keyType: 'string',
        valueType: [
            {min: 0, max: 1e13, order: 'desc'},
        ]
    })


    test("verifies pallel query takes in turn", async () => {

        await Promise.all([
            // TODO: add queries 
        ])

        // TODO : verify that race condition does not occur
    })
});