const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");
const { setupLogs } = require("../utils/setup");
const { jsonReadFile, jsonWriteFile } = require("../utils/file");
const { embedColor, successEmoji } = require("../config.json");
const { mutedRole } = require("../utils/muted");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MUTE_MEMBERS")) return;

    let reason = args.slice(1).join(" ");
    let member = message.guild.member(parseUser(client, args[0]));
    let logs = await setupLogs(message, "command-logs");
    let muteRole = await mutedRole(message.guild);

    if (!member) return message.channel.send("This is not a member id or mention!");
    if (!reason) reason = "Served punishment";
    if (!member.roles.cache.has(muteRole.id)) return message.channel.send("This user isn't muted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    // action
    const unmuteEmbed = new MessageEmbed()
        .setTitle("User Unmuted")
        .addField("User", member.user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Reason", reason, false)
        .setColor(embedColor)
        .setTimestamp();

    member.send(`You've been unmuted by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).catch(() => {
        message.channel.send("I wasn't able to DM this user.");
    });
    member.roles.remove(muteRole).then(async () => {
        logs.send(unmuteEmbed);

        let muted = await jsonReadFile("muted.json");
        delete muted[message.guild.id][member.id];
        jsonWriteFile("muted.json", muted);
    }).then(() => {
        message.channel.send(`${successEmoji} ${member.user.tag} has been unmuted.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "unmute",
    aliases: ["um"],
    description: "Unsilence someone.",
    usage: "unmute <member> <reason>"
};