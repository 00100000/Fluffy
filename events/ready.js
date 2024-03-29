const { jsonCreateFile, jsonReadFile, jsonWriteFile } = require("../utils/file");
const { mutedRole } = require("../utils/muted");

module.exports = async client => {
    await console.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.cache.size} server(s).`);

    client.user.setStatus("online");
    client.user.setActivity("fetch", { type: "PLAYING" });

    // Absolute Shit Show

    // set up files if they don"t already exist
    const dataFiles = ["./muted.json", "./banned.json", "./lockdown.json"];
    dataFiles.forEach(async path => {
        await jsonCreateFile(path, {});
    });
    await jsonCreateFile("./blacklist.json", {blacklist:[]});
    // check for unmuted and unbanned users
    setInterval(async () => {
        let muted = await jsonReadFile("./muted.json");
        let banned = await jsonReadFile("./banned.json");

        Object.keys(muted).forEach(async guildID => {
            if (!client.guilds.cache.has(guildID)) return;
            if (!client.guilds.cache.get(guildID).me.permissions.has("ADMINISTRATOR")) return;
            let muteRole = await mutedRole(client.guilds.cache.get(guildID));

            Object.keys(muted[guildID]).forEach(userID => {
                // if the mute isn"t timed, we don"t need to worry about it
                if (muted[guildID][userID] === -1) return;

                // if the mute IS timed, and the mute has expired, we can unmute them
                if (Date.now() > muted[guildID][userID]) {
                    // remove muted role
                    try {
                        client.guilds.cache.get(guildID).member(userID).roles.remove(muteRole);
                    } catch (e) {}

                    // delete from muted.json, write to file
                    delete muted[guildID][userID];
                    jsonWriteFile("muted.json", muted);
                }
            });
        });
        // same thing for banned, but we unban them instead of unmuting them
        Object.keys(banned).forEach(guildID => {
            if (!client.guilds.cache.has(guildID)) return;
            if (!client.guilds.cache.get(guildID).me.permissions.has("ADMINISTRATOR")) return;
            Object.keys(banned[guildID]).forEach(userID => {
                if (banned[guildID][userID] === -1) return;

                if (Date.now() > banned[guildID][userID]) {
                    client.guilds.cache.get(guildID).members.unban(userID);

                    delete banned[guildID][userID];
                    jsonWriteFile("banned.json", banned);
                }
            });
        });
    }, 30000);
}