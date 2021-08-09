const fs = require("fs");

async function jsonCreateFile (path, data = {}) {
    if (!fs.existsSync(path)) {
        await jsonWriteFile(path, data);
    }
    return true;
}

async function jsonReadFile (path) {
    return JSON.parse(fs.readFileSync(path, {encoding: "utf8"}));
}

async function jsonWriteFile (path, data) {
    if (data) {
        fs.writeFileSync(path, JSON.stringify(data), {encoding: "utf8"});
    }
    return true;
}

module.exports = {
    jsonCreateFile,
    jsonReadFile,
    jsonWriteFile
}