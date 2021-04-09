const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { embedColor, botClearChannel, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_MESSAGES", "MANAGE_MESSAGES")) return;

    let logs = client.channels.cache.get(botClearChannel);
    let trueCleared;
    const botPrefixes = ["!", "?", "&", "-", ">", "u.", "pls ", ".", "d?", "+", "%", "s."];
    // user issues
    if (!args[0]) args[0] = 25;
    if (isNaN(args[0])) return message.channel.send("You must provide a number of messages for me to clear!");
    if (args[0] > 100 || args[0] < 1) return message.channel.send("You can only clear between 1 and 100 messages!");
    // action
    const botClearEmbed = new MessageEmbed()
        .setTitle("Bot-Related Messages Cleared")
        .addField("Amount of Messages Filtered", args[0], false)
        .addField("Moderator", message.author.tag, false)
        .addField("Channel", message.channel.name + `(${message.channel.id})`, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    message.channel.messages.fetch({ limit: args[0] }).then(messages => {
        const toClear = messages.filter(m => m.author.bot || botPrefixes.some(p => {
            return (m.content.toLowerCase().startsWith(p));
        }));
        trueCleared = toClear.array().length;
        message.channel.bulkDelete(toClear);
    }).then(() => {
        message.channel.send(`${successEmoji} ${trueCleared} bot and bot-related messages cleared from the last ${args[0]} messages.`).then(message => {
            message.delete({ timeout: 5000 });
        })
    }).then(() => {
        logs.send(botClearEmbed);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
}

exports.help = {
    name: "botclear",
    aliases: ["bc"],
    description: "Purges bot and bot-related messages from a channel.",
    usage: "botclear [amount]"
};