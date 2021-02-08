const { jsonReadFile } = require('../utils/file');

module.exports = async (client, member) => {
    let muted = await jsonReadFile("muted.json");
    if (Object.keys(muted).includes(member.guild.id)) {
        if (Object.keys(muted[member.guild.id]).includes(member.id)) {
            let muteRole = member.guild.roles.cache.find(r => r.name === 'Muted');
            member.roles.add(muteRole);
        }
    }
};