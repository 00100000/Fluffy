const fs = require('fs');



const jsonCreateFile = async (path, data={}) => {
    if (!fs.existsSync(path)) {
        await jsonWriteFile(path, data);
    }
    return "done";
};

const jsonReadFile = async (path) => {
    return JSON.parse(fs.readFileSync(path, {encoding: 'utf8'}));
};

const jsonWriteFile = async (path, data) => {
    // wouldn't want to accidentally clear all our data, haha
    if (data) {
        fs.writeFileSync(path, JSON.stringify(data), {encoding: 'utf8'});
    }
    return "done";
};



module.exports = {
    jsonCreateFile,
    jsonReadFile,
    jsonWriteFile
};