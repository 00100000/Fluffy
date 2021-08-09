const { jsonReadFile } = require("../utils/file");
const { mutedRole } = require("../utils/muted");

module.exports = async (client, member) => {
    if (!client.guilds.cache.get(member.guild.id).me.permissions.has("ADMINISTRATOR")) return;
	// re-mute muted members that left and rejoined the server while supposed to be muted
    let muted = await jsonReadFile("muted.json");
    if (Object.keys(muted).includes(member.guild.id)) {
        if (Object.keys(muted[member.guild.id]).includes(member.id)) {
            let muteRole = await mutedRole(member.guild);
            member.roles.add(muteRole);
        }
    }
}