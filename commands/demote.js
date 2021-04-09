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
    if (!member.bannable) return message.channel.send("This user is too powerful to be demoted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (!member.roles.cache.has(staffRole)) return message.channel.send("This user can't be demoted any lower!");
    // find what role to demote a user to
    for (i = 0; i < roleHierarchy.length; i++) {
        if (member.roles.highest.id === roleHierarchy[i]) {
            roleToTake = parseRole(member, roleHierarchy[i]);
            break;
        }
    }
    // action
    const demoteEmbed = new MessageEmbed()
        .setTitle("User Demoted")
        .addField("User", member.user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Role Lost", roleToGive.name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    
    if (roleToTake.id === roleHierarchy[0]) member.roles.remove(staffRole);
    member.user.send(`You've been demoted by ${message.author.tag}, in ${message.guild.name}, and you are longer ${roleToTake.name}.`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    member.roles.remove(roleToTake).then(() => {
        logs.send(demoteEmbed);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${member.user.tag} has been demoted, losing ${roleToTake.name}.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });;
};

exports.help = {
    name: "demote",
    aliases: ["d"],
    description: "Demotes a staff member.",
    usage: "Demote <member>"
};
