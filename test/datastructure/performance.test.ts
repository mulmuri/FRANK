import { SumSegTree } from "../../src/datastructure";



describe('Segtree performance test', () => {

    const lRange = 0;
    const rRange = 1e9;

    const segtree = new SumSegTree(lRange, rRange);

    const count = 1e5;

    test('should finish the test in 1 sec', done => {
        for (let i=0; i<count; i++) {
            const choice = Math.floor(Math.random() * 2);
            let index, val, lIndex, rIndex;

            switch (choice) {
                case 0:
                    index = Math.floor(Math.random() * (rRange - lRange + 1)) + lRange;
                    val = Math.floor(Math.random() * (rRange - lRange + 1)) + lRange;
                    segtree.update(index, val);
                    break;
                case 1:
                    lIndex = Math.floor(Math.random() * (rRange - lRange + 1)) + lRange;
                    rIndex = Math.floor(Math.random() * (rRange - lRange + 1)) + lRange;
                    segtree.query(lIndex, rIndex);
                    break;
            }
        }
        done()
    }, 10);
});