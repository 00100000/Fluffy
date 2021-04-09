const ms = require("ms");
const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");
const { jsonReadFile, jsonWriteFile } = require("../utils/file");
const { embedColor } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "BAN_MEMBERS", "BAN_MEMBERS")) return;

    let logs = client.channels.cache.get("790446465851850794");
    let date = undefined;
    let reason = undefined;
    try {
        // assume the format is ?ban <userid> <date> <reason>
        reason = args.slice(2).join(" ");
        date = ms(args[1]);
        if (date === undefined) throw new Error("Not a date!");
    } catch {
        // not a valid date, or not provided
        // we know the format must be ?ban <userid> <reason>
        reason = args.slice(1).join(" ");
    }
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send("This is not a user id or mention!");
    if (message.guild.member(user)) {
        if (!message.guild.member(user).bannable) return message.channel.send("This user is too powerful to be banned!");
        if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
            return message.channel.send("You can't use this command on someone more or just as powerful as you!");
        }
    }
    if (!reason) reason = "Disruptive behavior";
    // action
    const banEmbed = new MessageEmbed()
        .setTitle("User Banned")
        .addField("User", user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Reason", reason, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    user.send(`You've been banned by ${message.author.tag}, in ${message.guild.name} for ${reason}. You may appeal your ban here: https://discord.gg/xhCCBvzbs8`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    logs.send(banEmbed).then(async () => {
        if (date) {
            // timed ban
            let member = message.guild.member(user);
            let banned = await jsonReadFile("banned.json");
            banned[member.guild.id] = banned[member.guild.id] || {};
            banned[member.guild.id][member.id] = date? (Date.now() + date) : -1;
            await jsonWriteFile("banned.json", banned);
            // timed ban
        }
        message.guild.members.ban(user, { reason: `${message.author.tag}: ${reason}` });
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${user.tag} has been banned.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "ban",
    aliases: ["b"],
    description: "Bans a user for a reason and DMs them.",
    usage: "ban <user> <reason>"
};