const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser, parseRole } = require("../utils/parse");
const { embedColor, staffRole, roleHierarchy } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    let logs = client.channels.cache.get("829737681696981013");
    let member = message.guild.member(parseUser(client, args[0]));
    let roleToTake;
    // user issues
    if (!member) return message.channel.send("This is not a member id or mention!");
    if (member.id === message.author.id) return message.channel.send("You can't demote yourself, silly!");
    if (!member.bannable) return message.channel.send("This user is too powerful to be demoted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (member.roles.cache.has(staffRole)) return message.channel.send("This member cannot be demoted any lower!");
    // find what role to demote the member to
    for (i = roleHierarchy.length - 1; i > 0; i--) {
        if (member.roles.cache.has(roleHierarchy[i])) return roleToTake = parseRole(member, roleHierarchy[i - 1]);
    }
    // action
    const demoteEmbed = new MessageEmbed()
        .setTitle("User Demoted")
        .addField("User", user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Demoted From", roleToTake.name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    user.send(`You've been demoted by ${message.author.tag}, in ${message.guild.name} to ${roleToTake.name}`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    logs.send(demoteEmbed).then(() => {
        member.roles.remove(roleToTake);
        if (roleToTake === roleHierarchy[0]) roles.remove(staffRole);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "demote",
    aliases: ["p"],
    description: "Demotes a staff member and DMs them.",
    usage: "demote <user>"
};