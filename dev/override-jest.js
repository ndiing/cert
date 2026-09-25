const util = require("util");
const inspect = (object) => util.inspect(object, false, null, true);

const reset = () => "\x1b[0m";
const bgReset = () => "\x1b[0m";
const black = (str) => "\x1b[30m" + str + reset();
const bgBlack = (str) => "\x1b[40m" + str + bgReset();
const red = (str) => "\x1b[31m" + str + reset();
const bgRed = (str) => "\x1b[41m" + str + bgReset();
const green = (str) => "\x1b[32m" + str + reset();
const bgGreen = (str) => "\x1b[42m" + str + bgReset();
const yellow = (str) => "\x1b[33m" + str + reset();
const bgYellow = (str) => "\x1b[43m" + str + bgReset();
const blue = (str) => "\x1b[34m" + str + reset();
const bgBlue = (str) => "\x1b[44m" + str + bgReset();
const magenta = (str) => "\x1b[35m" + str + reset();
const bgMagenta = (str) => "\x1b[45m" + str + bgReset();
const cyan = (str) => "\x1b[36m" + str + reset();
const bgCyan = (str) => "\x1b[46m" + str + bgReset();
const white = (str) => "\x1b[37m" + str + reset();
const bgWhite = (str) => "\x1b[47m" + str + bgReset();
const bold = (str) => "\x1b[1m" + str + "\x1b[22m";
const dim = (str) => "\x1b[2m" + str + "\x1b[22m";
const italic = (str) => "\x1b[3m" + str + "\x1b[23m";
const underline = (str) => "\x1b[4m" + str + "\x1b[24m";
const inverse = (str) => "\x1b[7m" + str + "\x1b[27m";
const hidden = (str) => "\x1b[8m" + str + "\x1b[28m";
const strikethrough = (str) => "\x1b[9m" + str + "\x1b[29m";

const marker = {};
const time = (mark) => (marker[mark] = performance.now());
const timeEnd = (mark, unit = "s", fraction = 1) => {
    const end = performance.now();
    const start = marker[mark];
    const duration = end - start;
    const units = {
        s: 1000,
        ms: 1,
    };
    const result = duration / units[unit];
    return result.toFixed(fraction) + unit;
};

const root = [];
const last = () => root[root.length - 1];
const add = (...items) => last().children.push(...items);
const sorters = ["beforeAll", "test", "afterAll"];
const sort = () => last().children.sort((a, b) => sorters.indexOf(a.type) - sorters.indexOf(b.type));
function describe(title, callback) {
    root.push({ type: "describe", title, callback, children: [] });
    callback();
    sort();
}
function test(title, callback) {
    add({ type: "test", title, callback });
}
function beforeAll(callback) {
    add({ type: "beforeAll", callback });
}
function afterAll(callback) {
    add({ type: "afterAll", callback });
}
const isAsyncFunction = (any) => toString.call(any) === "[object AsyncFunction]";
async function run() {
    let passed = 0;
    let failed = 0;
    time("suites");
    for (const r of root) {
        time("suite");
        r.passed = 0;
        r.failed = 0;
        for (const c of r.children) {
            time("test");
            try {
                if (["beforeAll", "afterAll"].includes(c.type) || isAsyncFunction(c.callback)) {
                    await c.callback();
                } else {
                    c.callback();
                }
                if (c.type === "test") r.passed++;
            } catch (error) {
                c.error = error;
                if (c.type === "test") r.failed++;
            }
            c.time = timeEnd("test", "ms", 2);
        }
        r.time = timeEnd("suite", "ms", 2);
        passed += r.passed;
        failed += r.failed;
        console.log(r.failed > 0 ? bgRed(" Failed ") : bgGreen(" Passed "), r.title, `(${r.time})`);
        for (const c of r.children) {
            if (c.type === "test") console.log(c.error ? red("✗") : green("✓"), dim(c.title), dim(`(${c.time})`));
            if (c.error) console.log(bgYellow(black("Error")), c.error);
        }
    }
    const arr = [];
    if (passed > 0) arr.push(green(`${passed} passed`));
    if (failed > 0) arr.push(red(`${failed} failed`));
    arr.push(white(`${passed + failed} total`));
    console.log(inverse(" Tests: "), arr.join(", "));
    console.log(inverse(" Time : "), timeEnd("suites"));
}
function expect(actual) {
    return {
        toEqual: (expected) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`actual:\r\n${inspect(actual)}\r\nexpected:\r\n${inspect(expected)}`);
            }
        },
        toBe: (expected) => {
            if (actual !== expected) {
                throw new Error(`actual:\r\n${actual}\r\nexpected:\r\n${expected}`);
            }
        },
        toThrow: (expected) => {
            try {
                actual();
            } catch (error) {
                if (error.message !== expected) {
                    throw new Error(`actual:\r\n${error.message}\r\nexpected:\r\n${expected}`);
                }
            }
        },
    };
}

global.describe = describe;
global.test = test;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.expect = expect;

run();
