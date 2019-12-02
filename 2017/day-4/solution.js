const fs = require("fs");
const assert = require("assert");
const treis = require("treis");
const {
    compose, split, map, reject, isNil, countBy, identity,
    length, equals, last, toPairs, isEmpty, join,
} = require("ramda");

const input = fs.readFileSync("./input.txt", "utf-8").trim();

function passcount(text, countFn = identity) {
    const data = compose(
        map(compose(
            reject(isNil),
            split(/\s+/)
        )),
        reject(isEmpty),
        reject(isNil),
        split("\n")
    )(text);

    const count = compose(
        length,
        reject(equals(false)),
        map(compose(
            equals(0),
            length,
            reject(equals(1)),
            map(last),
            toPairs,
            countBy(countFn)
        ))
    )(data);

    return count;
}

const test1 = `
aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa
111 222 111 222 111
aoa aoa
test
`;

const test2 = "";

const test3 = `
test one two
`;

const test4 = `
abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio
`;

const anagrammer = compose(
    join(""),
    (arr) => {
        arr.sort();
        return arr;
    },
    split("")
);

assert.strictEqual(passcount(test1.trim()), 3);
assert.strictEqual(passcount(test2.trim()), 0);
assert.strictEqual(passcount(test3.trim()), 1);
assert.strictEqual(passcount(test4.trim(), anagrammer), 3);

console.log(passcount(input));
console.log(passcount(input, anagrammer));
