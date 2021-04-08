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
    if (user.id === message.author.id) return message.channel.send("You can't promote yourself, silly!");
    if (message.guild.member(user)) {
        if (!message.guild.member(user).bannable) return message.channel.send("This user is too powerful to be promoted!");
        if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
            return message.channel.send("You can't use this command on someone more or just as powerful as you!");
        }
    } else {
        return message.channel.send("You can't promote someone not in this server/guild!");
    }
    // find what role the user has in the server
    // -1 = no staff
    let rolePosition = -1;
    for (i = 0; i < roleHierarchy.length; i++) {
        if (message.guild.member(user).roles.cache.has(roleHierarchy[i])) {
            rolePosition = i;
        }
    }

    if (rolePosition === roleHierarchy.length) return message.channel.send("This user can't be promoted any higher!");
    // action
    const promoteEmbed = new MessageEmbed()
        .setTitle("User Promoted")
        .addField("User", user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Promoted To", message.guild.member(user).roles.get(roleHierarchy[rolePosition + 1]).name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    user.send(`You've been promoted by ${message.author.tag}, in ${message.guild.name} to ${message.guild.member(user).roles.get(roleHierarchy[rolePosition + 1]).name}`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    logs.send(promoteEmbed).then(() => {
        message.guild.member(user).roles.add(roleHierarchy[rolePosition + 1]);
        if (rolePosition === -1) message.guild.member(user).roles.add(staffRole);
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