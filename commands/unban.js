const { MessageEmbed } = require("discord.js");
const { parseID } = require("../utils/parse");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { jsonReadFile, jsonWriteFile } = require("../utils/file");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "BAN_MEMBERS", "BAN_MEMBERS")) return;

    let logs = setupLogs(message, "command-logs");
    let reason = args.slice(1).join(" ");
    // user issues
    if (!args[0]) return message.channel.send("You didn't provide me with a user to unban!");
    if(!reason) reason = "Served punishment.";
    // action
    const unbanEmbed = new MessageEmbed()
        .setTitle("User Unbanned")
        .addField("User", args[0], false)
        .addField("Moderator", message.author.tag, false)
        .addField("Reason", reason, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    message.guild.members.unban(args[0]).then(async () => {
        logs.send(unbanEmbed);
        // timed unban
        let banned = await jsonReadFile("muted.json");
        delete banned[message.guild.id][parseID(args[0])];
        jsonWriteFile("banned.json", banned);
        // timed unban
    }).then(() => {
        message.channel.send(`${successEmoji} ${args[0]} has been unbanned.`);
    }).catch(e => {
        if (e.includes("Invalid Form Body")) {
            message.channel.send("This is not a valid User ID!");
        } else if (e.includes("Unknown Ban")) {
            message.channel.send("This user is not banned!");
        } else {
            message.channel.send(`\`\`\`${e}\`\`\``);
        }
    });
};

exports.help = {
    name: "unban",
    aliases: ["ub"],
    description: "Unbans a user for a reason and DMs them.",
    usage: "unban <user> <reason>"
};