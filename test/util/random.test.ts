import Random from "./random";



describe("same seed generates same result", () => {

    const A = new Random();
    const B = new Random();

    const count = 100;

    test("should generate same float", () => {
        for (let i = 0; i < count; i++) {
            expect(A.float()).toBe(B.float());
        }
    });

    test("should generate same int", () => {
        for (let i = 0; i < count; i++) {
            expect(A.int(0, 100)).toBe(B.int(0, 100));
        }
    });

    test("should generate same string", () => {
        for (let i = 0; i < count; i++) {
            expect(A.string(10)).toBe(B.string(10));
        }
    });

    test("should generate same hash", () => {
        for (let i = 0; i < count; i++) {
            expect(A.hash()).toBe(B.hash());
        }
    });
});