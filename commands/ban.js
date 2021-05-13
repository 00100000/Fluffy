const ms = require("ms");
const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");
const { setupLogs } = require("../utils/setup");
const { embedColor, successEmoji } = require("../config.json");
const { jsonReadFile, jsonWriteFile } = require("../utils/file");

exports.run = async (client, message, args) => {
    if (noPerms(message, "BAN_MEMBERS", "BAN_MEMBERS")) return;

    let logs = await setupLogs(message, "command-logs");
    let date = undefined;
    let reason = undefined;
    try {
        // assume the format is ?ban <userid> <date> <reason>
        reason = args.slice(2).join(" ");
        date = ms(args[1]);
        if (date === undefined) throw new Error("Not a date!");
        if (date < ms("10s")) return message.channel.send("Ban length must be longer than 10 seconds");
        if (date > ms("90d")) return message.channel.send("Ban length must be shorter than 90 days");
    } catch {
        // not a valid date, or not provided
        // we know the format must be ?ban <userid> <reason>
        reason = args.slice(1).join(" ");
    }
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) {
        user = args[0];
        message.guild.members.ban(user, { reason: `${message.author.tag}: ${args.slice(1).join(" ")}` })
            .then(() => {
                message.channel.send(`${successEmoji} ${user} has been banned.`);
            }).catch(e => {
                message.channel.send("This is not a user id or mention!");
            });
        return;
    }
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
        .setColor(embedColor);  

    user.send(`You've been banned by ${message.author.tag}, in ${message.guild.name} for ${reason}.`)
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
        }
        message.guild.members.ban(user, { reason: `${message.author.tag}: ${reason}` });
    }).then(() => {
        message.channel.send(`${successEmoji} ${user.tag} has been banned.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "ban",
    aliases: ["b"],
    description: "Bans a user for a reason and DMs them.",
    usage: "ban <user> <duration> <reason>"
};