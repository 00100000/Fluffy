const { MessageEmbed } = require("discord.js");
const { parseChannel } = require("../utils/parse");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_CHANNELS", "MANAGE_CHANNELS")) return;

    let logs = await setupLogs(message, "command-logs");
    let channel = parseChannel(message, args[0]);
    if (!channel) channel = message.channel;
    // user issues
    if (!channel.isText()) return message.channel.send("You can only use this on a text channel!");
    // action
    const lockEmbed = new MessageEmbed()
        .setTitle("Channel Unlocked")
        .addField("Channel", channel.name, false)
        .addField("Moderator", message.author.tag, false)
        .setColor(embedColor);

    logs.send(lockEmbed).then(() => {
        channel.updateOverwrite(message.guild.roles.everyone ,{
            "SEND_MESSAGES": true
        });
    }).then(() => {
        message.channel.send(`${successEmoji} #${channel.name} has been unlocked.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "unlock",
    aliases: ["ul"],
    description: "Unlocks a channel in a server.",
    usage: "unlock [channel]"
};