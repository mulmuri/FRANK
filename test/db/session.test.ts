import FRANK from "../../src/db/init";


describe("race condition problem should be avoided", () => {

    const db = FRANK({
        keyType: 'string',
        valueType: [
            {min: 0, max: 1e13, order: 'desc'},
        ]
    })

    // TODO: implement this test
});