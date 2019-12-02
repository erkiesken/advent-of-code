const fs = require("fs");
const assert = require("assert");
const {
    compose, split, map, reject, isNil, isEmpty, sort, equals, clone, any,
} = require("ramda");

const input = fs.readFileSync("./input.txt", "utf-8").trim();

function memcycle(text) {
    const data = compose(
        reject(Number.isNaN),
        map(n => parseInt(n, 10)),
        reject(isEmpty),
        split(/\s+/)
    )(text);
    console.log("solving:", data.join(","));

    let steps = 0;
    const mem = clone(data);
    const len = data.length;
    let idx;
    let max;
    let pending;
    let state;
    const states = new Set();

    while (true) {
        max = Math.max.apply(null, mem);
        idx = mem.indexOf(max);
        pending = mem[idx];
        mem[idx] = 0;
        while (pending) {
            idx = (idx + 1) % len;
            mem[idx] = mem[idx] + 1;
            pending -= 1;
        }
        steps += 1;

        state = mem.join(",");
        if (states.has(state)) {
            console.log(`found in ${steps} steps:`, state);
            break;
        }
        states.add(state);
    }
    console.log("loop size:", states.size - Array.from(states.values()).indexOf(state));

    return steps;
}

const sample1 = `0 2 7 0`;

assert.strictEqual(memcycle(sample1.trim()), 5);

console.log(memcycle(input));
