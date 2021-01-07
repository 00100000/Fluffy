const { jsonReadFile, jsonCreateFile, jsonWriteFile } = require("./utils/file");
const size = 2**28;
console.log(`Testing create/read/write with json size ${size}`);

const jsonThing = {"lotsOfData": "a".repeat(size)};

(async () => {
    console.time("create");
    await jsonCreateFile("test.json", jsonThing);
    console.timeEnd("create");

    console.time("read");
    await jsonReadFile("test.json");
    console.timeEnd("read");

    const newJsonThing = {"lotsOfData": "b".repeat(size)};

    console.time("write");
    await jsonWriteFile("test.json", newJsonThing);
    console.timeEnd("write");
})();

