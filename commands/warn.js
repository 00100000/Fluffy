const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");
const { setupLogs } = require("../utils/setup");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "SEND_MESSAGES", "MANAGE_NICKNAMES")) return;

    let logs = setupLogs(message, "command-logs");
    let reason = args.slice(1).join(" ");
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send("You didn't provide me with a user to warn!");
    if (!message.guild.member(user)) return message.channel.send("This user is not in this server!");
    if (!message.guild.member(user).bannable) return message.channel.send("This user is too powerful to be warned!");
    if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (!reason) reason = "Disruptive behavior";
    // action
    const warnEmbed = new MessageEmbed()
        .setTitle("User Warned")
        .addField("User", user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Reason", reason, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    user.send(`You've been warned by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).catch(() => {
        message.channel.send("I wasn't able to DM this user.");
    });
    logs.send(warnEmbed).then(() => {
        message.channel.send(`${successEmoji} ${user.tag} has been warned for \`${reason}\`.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "warn",
    aliases: ["w"],
    description: "Warns a user.",
    usage: "warn <user> <reason>"
};