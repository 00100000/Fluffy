const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser, parseRole } = require("../utils/parse");
const { embedColor, staffRole, roleHierarchy } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    let logs = client.channels.cache.get("829737681696981013");
    let member = message.guild.member(parseUser(client, args[0]));
    let roleToGive = -1;
    // user issues
    if (!member) return message.channel.send("This is not a member id or mention!");
    if (member.id === message.author.id) return message.channel.send("You can't promote yourself, silly!");
    if (!member.bannable) return message.channel.send("This user is too powerful to be promoted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (member.roles.cache.has(roleHierarchy.length - 1)) return message.channel.send("This member cannot be promoted any higher!");
    // find what role to promote the member to
    for (i = roleHierarchy.length - 2; i >= 0; i--) {
        if (member.roles.cache.has(roleHierarchy[i])) return roleToGive = parseRole(member, roleHierarchy[i + 1]);
    }
    // action
    const promoteEmbed = new MessageEmbed()
        .setTitle("User Promoted")
        .addField("User", user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Promoted To", roleToGive.name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    user.send(`You've been promoted by ${message.author.tag}, in ${message.guild.name} to ${roleToGive.name}`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    logs.send(promoteEmbed).then(() => {
        if (roleToGive === -1) {
            member.roles.add(staffRole);
            member.roles.add(roleHierarchy[0]);
        } else {
            member.roles.add(roleToGive);
        }
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "promote",
    aliases: ["p"],
    description: "Promotes a staff member and DMs them.",
    usage: "promote <user>"
};