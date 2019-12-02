const fs = require("fs");
const assert = require("assert");
const { forEach, compose, split, map, reject, isNil, sort } = require("ramda");

const input = fs.readFileSync("./input.txt", "utf-8").trim();

function checksum1(text) {
    const data = compose(
        map(compose(
            reject(isNil),
            map(n => parseInt(n, 10)),
            split(/\s+/)
        )),
        reject(isNil),
        split("\n")
    )(text);
    let sum = 0;

    forEach((line) => {
        const min = Math.min.apply(null, line);
        const max = Math.max.apply(null, line);
        const diff = max - min;
        sum += diff;
    }, data);

    return sum;
}

function checksum2(text) {
    const diff = (a, b) => (b - a);
    const data = compose(
        map(compose(
            sort(diff),
            reject(isNil),
            map(n => parseInt(n, 10)),
            split(/\s+/)
        )),
        reject(isNil),
        split("\n")
    )(text);
    let sum = 0;

    forEach((line) => {
        let div;
        outer:
        for (let i = 0; i < line.length; i += 1) {
            for (let j = i + 1; j < line.length; j += 1) {
                div = line[i] / line[j];
                if (Number.isInteger(div)) {
                    sum += div;
                    continue outer;
                }
            }
        }
    }, data);

    return sum;
}

const sample1 = `
5 1 9 5
7 5  3
2 4 6 8 
`;
const sample2 = `
5 9 2 8
9 4 7 3
3 8 6 5
`;

assert.strictEqual(checksum1(sample1.trim()), 18);
assert.strictEqual(checksum2(sample2.trim()), 9);

console.log(checksum1(input));
console.log(checksum2(input));

