const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { jsonReadFile, jsonWriteFile } = require("../utils/file");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_CHANNELS", "ADMINISTRATOR")) return;

    let logs = setupLogs(message, "command-logs");
    // action
    const endlockdownEmbed = new MessageEmbed()
        .setTitle("Lockdown Ended")
        .addField("Moderator", message.author.tag, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(endlockdownEmbed).then(async () => {
        let lockedDownPerms = await jsonReadFile("lockdown.json");
        const guildID = message.guild.id;

        message.guild.channels.cache.forEach(async channel => {
            // brain death
            if (lockedDownPerms?.[guildID]?.[channel.id] !== undefined) {
                channel.updateOverwrite(message.guild.roles.everyone, {
                    "SEND_MESSAGES": lockedDownPerms[guildID][channel.id]
                });
                    
                delete lockedDownPerms[guildID][channel.id];
            }
        });

        await jsonWriteFile("lockdown.json", lockedDownPerms);
    }).then(() => {
        message.channel.send(`${successEmoji} The lockdown in ${message.guild.name} has been ended.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "unlockdown",
    aliases: ["uld"],
    description: "Ends a lockdown.",
    usage: "unlockdown"
};