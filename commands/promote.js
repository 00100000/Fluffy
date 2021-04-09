const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser, parseRole } = require("../utils/parse");
const { embedColor, staffRole, roleHierarchy } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    let logs = client.channels.cache.get("829737681696981013");
    let member = message.guild.member(parseUser(client, args[0]));
    let roleToGive;
    // member issues
    if (!member) return message.channel.send("This is not a member id or mention!");
    if (member.bannable) return message.channel.send("This user is too powerful to be promoted!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (member.roles.highest.id === roleHierarchy[roleHierarchy.length - 1]) return message.channel.send("This user can't be promoted any higher!");
    // find what role to promote a user to
    for (i = 0; i < roleHierarchy.length; i++) {
        if (member.roles.highest.id === roleHierarchy[i]) {
            roleToGive = parseRole(member, roleHierarchy[i + 1]);
            break;
        }
    }
    if (!roleToGive) roleToGive = parseRole(member, roleHierarchy[0]);
    // action
    const promoteEmbed = new MessageEmbed()
        .setTitle("User Promoted")
        .addField("User", member.user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Promoted To", roleToGive.name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    
    if (!member.roles.cache.has(staffRole)) member.roles.add(staffRole);
    user.send(`You've been promoted by ${message.author.tag}, in ${message.guild.name} to ${roleToGive.name}.`)
        .catch(() => {
            message.channel.send("I wasn't able to DM this user.");
        });
    member.roles.add(roleToGive).then(() => {
        logs.send(promoteEmbed);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${member.user.tag} has been promoted to ${roleToGive.name}.`);
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