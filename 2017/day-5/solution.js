const fs = require("fs");
const assert = require("assert");
const { forEach, compose, split, map, reject, isNil, isEmpty, sort } = require("ramda");

const input = fs.readFileSync("./input.txt", "utf-8").trim();

function mazejump(text) {
    const data = compose(
        reject(isNil),
        map(n => parseInt(n, 10)),
        reject(isEmpty),
        split("\n")
    )(text);

    let steps = 0;
    let cursor = 0;
    const min = 0;
    const max = data.length - 1;
    let offset;

    while (true) {
        steps += 1;
        offset = data[cursor];
        data[cursor] += 1;
        cursor += offset;
        if (cursor < min || cursor > max) {
            break;
        }
    }

    return steps;
}

function mazejump2(text) {
    const data = compose(
        reject(isNil),
        map(n => parseInt(n, 10)),
        reject(isEmpty),
        split("\n")
    )(text);

    let steps = 0;
    let cursor = 0;
    const min = 0;
    const max = data.length - 1;
    let offset;

    while (true) {
        steps += 1;
        offset = data[cursor];
        if (offset >= 3) {
            data[cursor] -= 1;
        } else {
            data[cursor] += 1;
        }
        cursor += offset;
        if (cursor < min || cursor > max) {
            break;
        }
    }

    return steps;
}

const sample1 = `
0
3
0
1
-3
`;

assert.strictEqual(mazejump(sample1.trim()), 5);

console.log(mazejump(input));
console.log(mazejump2(input));
