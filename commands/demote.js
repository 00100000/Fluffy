const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");
const { embedColor, staffRole, roleHierarchy } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    let logs = client.channels.cache.get("829737681696981013");
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send("This is not a user id or mention!");
    if (message.guild.member(user)) {
        if (!message.guild.member(user).bannable) return message.channel.send("This user is too powerful to be demoted!");
        if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
            return message.channel.send("You can't use this command on someone more or just as powerful as you!");
        }
    } else {
        return message.channel.send("You can't demote someone not in this server/guild!");
    }
    // find what role the user has in the server
    // -1 = no staff
    let rolePosition = -1;
    for (i = 0; i < roleHierarchy.length; i++) {
        if (message.guild.member(user).roles.cache.has(roleHierarchy[i])) {
            rolePosition = i;
        }
    }

    if (rolePosition = -1) return message.channel.send("This user can't be demoted any lower!");
    // action
    const demoteEmbed = new MessageEmbed()
        .setTitle("User Demoted")
        .addField("User", user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Demoted To", rolePosition === 0 ? "No Staff" : message.guild.roles.get(roleHierarchy[rolePosition - 1]).name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    user.send(`You've been demoted by ${message.author.tag}, in ${message.guild.name} to ${rolePosition === 0 ? "No Staff" : message.guild.roles.get(roleHierarchy[rolePosition - 1]).name}`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    logs.send(demoteEmbed).then(() => {
        message.guild.member(user).roles.remove(roleHierarchy[rolePosition]);
        if (rolePosition === 0) message.guild.member(user).roles.remove(staffRole);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "demote",
    aliases: ["d"],
    description: "Demotes a staff member and DMs them.",
    usage: "demote <user>"
};