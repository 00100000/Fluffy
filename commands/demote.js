const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser, parseRole } = require("../utils/parse");
const { embedColor, staffAnnouncementsChannel, staffRole, roleHierarchy, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    let announcements = client.channels.cache.get(staffAnnouncementsChannel);
    let member = message.guild.member(parseUser(client, args[0]));
    let newRole;
    let oldRole;
    // user issues
    if (!member) return message.channel.send("This is not a member id or mention!");
    if (!member.bannable) return message.channel.send("This user is too powerful to be demoted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (!member.roles.cache.has(staffRole)) return message.channel.send("This user can't be demoted any lower!");
    if (member.roles.highest.id === roleHierarchy[0]) newRole = "No Staff";
    // find what role to demote a user to
    for (i = 0; i < roleHierarchy.length; i++) {
        if (member.roles.highest.id === roleHierarchy[i]) {
            if (!newRole) newRole = parseRole(member, roleHierarchy[i - 1]).name;
            oldRole = parseRole(member, roleHierarchy[i]);
            break;
        }
    }
    // action
    const demoteEmbed = new MessageEmbed()
        .setTitle("Demotion: " + member.user.tag)
        .setDescription(`**${oldRole.name} ➜ ${newRole}**`)
        .setColor(embedColor);
    
    if (oldRole.id === roleHierarchy[0]) member.roles.remove(staffRole);
    member.user.send(`You've been demoted by ${message.author.tag}, in ${message.guild.name}, and you are longer ${oldRole.name}.`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    member.roles.remove(oldRole).then(() => {
        announcements.send(demoteEmbed);
    }).then(() => {
        message.channel.send(`${successEmoji} ${member.user.tag} has been demoted, losing ${oldRole.name}.`);
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
