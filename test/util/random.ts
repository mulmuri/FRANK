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

    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    charUpper(): string {
        const randomIndex = this.random.integer(0, this.chars.length-1);
        return this.chars[randomIndex];
    }

    string(length: number): string {
        return this.random.string(length);
    }

    hash(): string {
        const hash = crypto.createHash('sha256'); // You can use 'sha256', 'sha1', 'md5', etc.
        hash.update(Number.toString());
        return hash.digest('hex');
    }

    startDate = new Date(2000, 0, 1);  // January 1, 2000
    endDate = new Date(2023, 12, 31);  // December 31, 2023

    date(): Date {
        return new Date(this.startDate.getTime() + Math.random() * (this.endDate.getTime() - this.startDate.getTime()));
    }
}

export default Random;

