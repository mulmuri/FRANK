import { Random as RandomSeed, MersenneTwister19937 } from "random-js";
import * as crypto from 'crypto';


import dotenv from 'dotenv';
dotenv.config();

const seed = parseInt(process.env.RANDOM_SEED || (() => { throw new Error("environment RANDOM_SEED is not set"); })());

class Random {

    random: RandomSeed;

    constructor() {
        const engine = MersenneTwister19937.seed(seed);
        this.random = new RandomSeed(engine);
    }

    float(): number {
        return this.random.real(0, 1);
    }

    int(low: number, high: number): number {
        return this.random.integer(low, high);
    }

    string(length: number): string {
        return this.random.string(length);
    }

    hash(): string {
        const hash = crypto.createHash('sha256'); // You can use 'sha256', 'sha1', 'md5', etc.
        hash.update(Number.toString());
        return hash.digest('hex');
    }
}

export default Random;

