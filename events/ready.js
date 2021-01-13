const { jsonCreateFile, jsonReadFile, jsonWriteFile } = require('../utils/file');

module.exports = async client => {
    await client.logger.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.cache.size} server(s).`);
    
    client.user.setStatus('online');
    client.user.setActivity('Chill Hub', { type: 'WATCHING' });

    await jsonCreateFile('./muted.json', {});
    await jsonCreateFile('./banned.json', {});
    await jsonCreateFile('./blacklist.json', {blacklist:[]});

    // timed mutes/bans
    // lord please forgive me for the code I'm about to put out into the world
    // I unfortunately can't make this any simpler, so I'll excessively comment to compensate for the density of this code
    // the uncommented sections should be pretty self-explanatory
    setInterval(async () => {
        let muted = await jsonReadFile('./muted.json');
        let banned = await jsonReadFile('./banned.json');

        Object.keys(muted).forEach(guildID => {
            let muteRole = client.guilds.cache.get(guildID).roles.cache.find(r => r.name === 'Muted');

            Object.keys(muted[guildID]).forEach(userID => {
                // if the mute isn't timed, we don't need to worry about it
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
            Object.keys(banned[guildID]).forEach(userID => {
                if (banned[guildID][userID] === -1) return;
                
                if (Date.now() > banned[guildID][userID]) {
                    client.guilds.cache.get(guildID).members.unban(userID);
                    
                    delete banned[guildID][userID];
                    jsonWriteFile("banned.json", banned);
                }
            });
        });
    }, 15000);
};