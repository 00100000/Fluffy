const { MessageEmbed } = require("discord.js");
const { parseUser } = require("../utils/parse");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_MESSAGES", "MANAGE_MESSAGES")) return;

    let logs = setupLogs(message, "command-logs");
    let user = parseUser(client, args[0]);
    let amount = user ? args[1] : args[0];
    let trueCleared;
    // user issues
    if (!amount) amount = 25;
    if (isNaN(amount)) return message.channel.send("You must provide a number of messages for me to clear!");
    if (amount > 100 || amount < 1) return message.channel.send("You can only clear between 1 and 100 messages!");
    // action
    if (user) {
        if (message.guild.member(user)) {
            if (!message.guild.member(user).bannable) return message.channel.send("This user is too powerful to have their messages cleared!");
            if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
                return message.channel.send("You can't use this command on someone more or just as powerful as you!");
            }
        }
        const clearEmbed = new MessageEmbed()
            .setTitle("User's Messages Cleared")
            .addField("Amount of Messages", amount, false)
            .addField("User", user.tag, false)
            .addField("Moderator", message.author.tag, false)
            .addField("Channel", message.channel.name + `(${message.channel.id})`, false)
            .addField("Server", message.guild.name + `(${message.guild.id})`, false)
            .setColor(embedColor)
            .setTimestamp();
        message.channel.messages.fetch({ limit: amount }).then(messages => {
            const toClear = messages.filter(m => m.author.id === user.id);
            trueCleared = toClear.array().length;
            message.channel.bulkDelete(toClear);
        }).then(() => {
            logs.send(clearEmbed);
        }).then(() => {
            message.channel.send(`${successEmoji} ${trueCleared} of the last ${amount} messages from ${user.tag} have been cleared.`);
        }).catch(e => {
            message.channel.send(`\`\`\`${e}\`\`\``);
        });
    } else {
        const nukeEmbed = new MessageEmbed()
            .setTitle("Messages Cleared")
            .addField("Amount of Messages", amount, false)
            .addField("Channel", message.channel.name + `(${message.channel.id})`, false)
            .addField("Moderator", message.author.tag, false)
            .addField("Server", message.guild.name + `(${message.guild.id})`, false)
            .setColor(embedColor)
            .setTimestamp();
        message.delete().then(() => {
            message.channel.bulkDelete(amount, true);
        }).then(() => {
            logs.send(nukeEmbed);
        }).catch(e => {
            message.channel.send(`\`\`\`${e}\`\`\``);
        });
    }
}

exports.help = {
    name: "clear",
    aliases: ["c"],
    description: "Purges messages from a specific channel. Optionally from a user. Defaults to 25.",
    usage: "clear [user] [amount]"
};