const ms = require("ms");
const { MessageEmbed } = require("discord.js");
const { parseUser } = require("../utils/parse");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { jsonReadFile, jsonWriteFile } = require("../utils/file");
const { embedColor, successEmoji } = require("../config.json");
const { mutedRole } = require("../utils/muted");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MUTE_MEMBERS")) return;

    let date = undefined;
    let reason = undefined;
    try {
        // assume the format is ?mute <userid> <date> <reason>
        reason = args.slice(2).join(" ");
		// if date ends with a number, assume it's in minutes
		if (args[1].match(/[0-9]$/)) args[1] += "m";
        date = ms(args[1]);
        if (date === undefined) throw new Error("Not a date! Sad.");
        if (date < ms("10s")) return message.channel.send("Mute length must be longer than 10 seconds");
        if (date > ms("90d")) return message.channel.send("Mute length must be shorter than 90 days");
    } catch {
        // not a valid date, or not provided
        // we know the format must be ?mute <userid> <reason>
        reason = args.slice(1).join(" ");
    }
    let member = message.guild.member(parseUser(client, args[0]));
    let logs = await setupLogs(message, "command-logs");
    let muteRole = await mutedRole(message.guild);

    if (!member) return message.channel.send("This is not a member id or mention!");
    if (!reason) reason = "Disruptive behavior";
    if (member.roles.cache.has(muteRole.id)) return message.channel.send("This user is already muted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    // action
    const muteEmbed = new MessageEmbed()
        .setTitle("User Muted")
        .addField("User", member.user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Reason", reason, false)
        .setColor(embedColor);

    const dateMessage = date ? "for " + (ms(date, {long: true})) : "indefinitely";
    member.send(`You've been muted by ${message.author.tag}, in ${message.guild.name} for ${reason} ${dateMessage}.`).catch(() => {
        message.channel.send("I wasn't able to DM this user.");
    });
    member.roles.add(muteRole).then(async () => {
        logs.send(muteEmbed);
        // timed mute
        let muted = await jsonReadFile("muted.json");
        muted[member.guild.id] = muted[member.guild.id] || {};
        muted[member.guild.id][member.id] = date ? (Date.now() + date) : -1;
        await jsonWriteFile("muted.json", muted);
        // timed mute
    }).then(() => {
        message.channel.send(`${successEmoji} ${member.user.tag} has been muted ${dateMessage}.`);
    }).catch(e => {
        console.trace(e);
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "mute",
    aliases: ["m"],
    description: "Silence someone with the power of the mute command.",
    usage: "mute <member> <duration> <reason>"
};