const fs = require("fs");
const assert = require("assert");
const { head, append, compose, split, map } = require("ramda");

const input = fs.readFileSync("./input.txt", "utf-8").trim();

function captcha1(text) {
    const digits = compose(
        // Add head to end of list for wrap-around
        (list) => append(head(list), list),
        map(n => parseInt(n, 10)),
        split("")
    )(text);
    let total = 0;
    const end = digits.length - 1;
    for (let i = 0; i < end; i += 1) {
        if (digits[i] === digits[i + 1]) {
            total += digits[i];
        }
    }
    return total;
}

assert.strictEqual(captcha1("1122"), 3);
assert.strictEqual(captcha1("1111"), 4);
assert.strictEqual(captcha1("1234"), 0);
assert.strictEqual(captcha1("91212129"), 9);

console.log(captcha1(input));


function captcha2(text) {
    const digits = compose(
        map(n => parseInt(n, 10)),
        split("")
    )(text);
    let total = 0;
    const size = digits.length;
    const half = size / 2;

    let j;
    for (let i = 0; i < size; i += 1) {
        j = (i + half) % size;
        if (digits[i] === digits[j]) {
            total += digits[i];
        }
    }
    return total;
}

assert.strictEqual(captcha2("1212"), 6);
assert.strictEqual(captcha2("1221"), 0);
assert.strictEqual(captcha2("123425"), 4);
assert.strictEqual(captcha2("123123"), 12);
assert.strictEqual(captcha2("12131415"), 4);

console.log(captcha2(input));
