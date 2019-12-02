const assert = require("assert");
const { add, reduce } = require("ramda");

function memdist(n) {
    let dir = "e";
    let r = 0;
    let dx = 0;
    let dy = 0;

    for (let i = 2; i <= n; i += 1) {
        if ("e" === dir) {
            dx += 1;
            // Moving east, turn north
            if (dx > r) {
                dir = "n";
                r += 1;
            }
        } else if ("n" === dir) {
            dy -= 1;
            // Moving north, turn west
            if (dy <= -r) {
                dir = "w";
            }
        } else if ("w" === dir) {
            dx -= 1;
            // Moving west, turn south
            if (dx <= -r) {
                dir = "s";
            }
        } else if ("s" === dir) {
            dy += 1;
            // Moving south, turn east
            if (dy >= r) {
                dir = "e";
            }
        }
        if (i === n) {
            break;
        }
    }

    return Math.abs(dx) + Math.abs(dy);
}


assert.strictEqual(memdist(1), 0);
assert.strictEqual(memdist(12), 3);
assert.strictEqual(memdist(23), 2);
assert.strictEqual(memdist(1024), 31);

console.log(memdist(368078));


function memsum(n, opts = {}) {
    let dir = "e";
    let r = 0;
    let dx = 0;
    let dy = 0;
    const grid = {};
    const setSum = (x, y, sum) => grid[`${x}:${y}`] = sum;
    const getSum = (x, y) => grid[`${x}:${y}`] || 0;
    const addNearby = (x, y) => reduce(add, 0, [
        getSum(x - 1, y - 1),
        getSum(x - 1, y),
        getSum(x - 1, y + 1),
        getSum(x, y - 1),
        getSum(x, y + 1),
        getSum(x + 1, y - 1),
        getSum(x + 1, y),
        getSum(x + 1, y + 1),
    ]);
    let sum = 1;
    grid[`0:0`] = sum;

    for (let i = 2; i <= n; i += 1) {
        if ("e" === dir) {
            dx += 1;
            // Moving east, turn north
            if (dx > r) {
                dir = "n";
                r += 1;
            }
        } else if ("n" === dir) {
            dy -= 1;
            // Moving north, turn west
            if (dy <= -r) {
                dir = "w";
            }
        } else if ("w" === dir) {
            dx -= 1;
            // Moving west, turn south
            if (dx <= -r) {
                dir = "s";
            }
        } else if ("s" === dir) {
            dy += 1;
            // Moving south, turn east
            if (dy >= r) {
                dir = "e";
            }
        }
        sum = addNearby(dx, dy);
        setSum(dx, dy, sum);

        if (opts.test && i === n) {
            break;
        } else if (!opts.test && sum > n) {
            break;
        }
    }

    return sum;
}

const test = { test: true };
assert.strictEqual(memsum(1, test), 1);
assert.strictEqual(memsum(2, test), 1);
assert.strictEqual(memsum(3, test), 2);
assert.strictEqual(memsum(4, test), 4);
assert.strictEqual(memsum(5, test), 5);
assert.strictEqual(memsum(13, test), 59);
assert.strictEqual(memsum(19, test), 330);
assert.strictEqual(memsum(23, test), 806);

console.log(memsum(368078));
