const { MessageEmbed } = require("discord.js");
const { parseUser } = require("../utils/parse");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_NICKNAMES", "MANAGE_NICKNAMES")) return;

    let logs = setupLogs(message, "command-logs");
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send("This is not a user id or mention!");
    if (!message.guild.member(user)) return message.channel.send("This user is not in this server!");
    let newNick = args.slice(1).join(" ");
    let oldNick = message.guild.member(user).displayName;
    if (!newNick) return message.channel.send("You didn't tell me what you want the new nickname to be!");
    if (newNick.length > 32) return message.channel.send("The nickname must be less than 32 characters long!");
    if (!message.guild.member(user).bannable) return message.channel.send("This user is too powerful to have their nickname changed!");
    if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    // action
    const nickEmbed = new MessageEmbed()
        .setTitle("Moderator Changed A User's Nickame")
        .addField("User", user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Old Nickname", oldNick, false)
        .addField("New Nickname", newNick, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    // change nick
    message.guild.member(user).setNickname(newNick).then(() => {
        message.channel.send(`${successEmoji} ${user.tag}'s New Nickname: ${newNick}`);
    }).then(() => {
        logs.send(nickEmbed);
    });
};

exports.help = {
    name: "setnick",
    aliases: ["nick", "sn"],
    description: "For changing naughty nicknames on mobile, and keeping track of them.",
    usage: "setnick <user> <new nickname>"
};