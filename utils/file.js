const fs = require('fs');



const jsonCreateFile = async (path, data={}) => {
    if (!fs.existsSync(path)) jsonWriteFile(path, data);
};

const jsonReadFile = (path) => {
    return JSON.parse(fs.readFileSync(path, {encoding: 'utf8'}));
};

const jsonWriteFile = (path, data) => {
    // wouldn't want to accidentally clear all our data, haha
    if (data) fs.writeFileSync(path, JSON.stringify(data), {encoding: 'utf8'});
};



module.exports = {
    jsonCreateFile,
    jsonReadFile,
    jsonWriteFile
};