const { jsonReadFile } = require("../utils/file");

module.exports = async (client, member) => {
    let muted = await jsonReadFile("muted.json");
    if (Object.keys(muted).includes(member.guild.id)) {
        if (Object.keys(muted[member.guild.id]).includes(member.id)) {
            let muteRole = member.guild.roles.cache.find(r => r.name === "Muted");
            member.roles.add(muteRole);
        }
    }

    if (Date.now() - member.user.createdAt < 604800000) {
        member.user.send("Please wait until your account is at least a week old before joining this server! This is to prevent botted user accounts from joining this server.")
            .catch(e => {
                errorChannel.send(`\`\`\`${e}\`\`\``);
        });
        member.kick("Joingate: Account under 1 week old");
    }
};