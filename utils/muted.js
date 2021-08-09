// we can assume noPerms(message, "MANAGE_ROLES", "MUTE_MEMBERS") was already called, so no need for more perm checks
async function mutedRole(guild) {
    let muteRole = guild.roles.cache.find(r => r.name === "Muted");

    if (!muteRole) {
        muteRole = await guild.roles.create({
            data: {
                name: "Muted",
                color: "#000000",
                permissions: 0
            },
            reason: "Automatic setup of Muted role"
        });

        guild.channels.cache.forEach(async (channel, id) => {
            if (channel.type == "voice") {
                await channel.createOverwrite(muteRole, { CONNECT: false }, "Automatic setup of Muted role");
            } else {
                await channel.createOverwrite(muteRole, { SEND_MESSAGES: false, ADD_REACTIONS: false }, "Automatic setup of Muted role");
            }
        });
    }

    return muteRole;
}

module.exports = {
    mutedRole
}