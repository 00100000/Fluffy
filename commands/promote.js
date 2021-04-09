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
    // member issues
    if (!member) return message.channel.send("This is not a member id or mention!");
    if (!member.bannable) return message.channel.send("This user is too powerful to be promoted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (member.roles.highest.id === roleHierarchy[roleHierarchy.length - 1]) return message.channel.send("This user can't be promoted any higher!");
    // find what role to promote a user to
    for (i = 0; i < roleHierarchy.length; i++) {
        if (member.roles.highest.id === roleHierarchy[i]) {
            newRole = parseRole(member, roleHierarchy[i + 1]);
            oldRole = parseRole(member, roleHierarchy[i].name);
            break;
        }
    }
    if (!newRole) {
        newRole = parseRole(member, roleHierarchy[0]);
        oldRole = "No Staff";
    }
    // action
    const promoteEmbed = new MessageEmbed()
        .setTitle("Promotion: " + member.user.tag)
        .setDescription(`**${oldRole} ➜ ${newRole.name}**`)
        .setColor(embedColor);
    
    if (!member.roles.cache.has(staffRole)) member.roles.add(staffRole);
    member.user.send(`You've been promoted by ${message.author.tag}, in ${message.guild.name} to ${newRole.name}.`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    member.roles.add(newRole).then(() => {
        announcements.send(promoteEmbed);
    }).then(() => {
        message.channel.send(`${successEmoji} ${member.user.tag} has been promoted to ${newRole.name}.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });;
};

exports.help = {
    name: "promote",
    aliases: ["p"],
    description: "Promotes a staff member.",
    usage: "promote <member>"
};
