const { MessageEmbed } = require("discord.js");
const { parseChannel } = require("../utils/parse");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_CHANNELS", "MANAGE_CHANNELS")) return;

    let logs = setupLogs(message, "command-logs");
    let channel = parseChannel(message, args[0]);
    if (!channel) channel = message.channel;
    // user issues
    if (!channel.isText()) return message.channel.send("You can only use this on a text channel!");
    // action
    const lockEmbed = new MessageEmbed()
        .setTitle("Channel Locked")
        .addField("Channel", channel.name, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(lockEmbed).then(() => {
        channel.updateOverwrite(message.guild.roles.everyone ,{
            "SEND_MESSAGES": false
        });
    }).then(() => {
        message.channel.send(`${successEmoji} #${channel.name} has been locked.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "lock",
    aliases: ["l"],
    description: "Locks a channel in a server.",
    usage: "lock [channel]"
};