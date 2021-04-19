const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { setupLogs } = require("../utils/setup");
const { parseUser, parseRole } = require("../utils/parse");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    let logs = setupLogs(message, "command-logs");
    let member = message.guild.member(parseUser(client, args[0]));
    let roleToGive = parseRole(member, args.slice(1).join(" "));
    // user issues
    if (!member) return message.channel.send("This is not a member id or mention!");
    if (!roleToGive) return message.channel.send("This is not a valid role, role mention, or role ID.");
    if (member.roles.cache.has(roleToGive.id)) return message.channel.send("This user already has this role!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (roleToGive.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't give someone a role higher than or equal to yours!");
    }
    // action
    const giveEmbed = new MessageEmbed()
        .setTitle("Role Given to User")
        .addField("User", member.user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Role", roleToGive.name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    member.roles.add(roleToGive).then(() => {
        logs.send(giveEmbed);
    }).then(() => {
        message.channel.send(`${successEmoji} ${member.user.tag} has been given the role ${roleToGive.name}.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });;
};

exports.help = {
    name: "giverole",
    aliases: ["grole", "gr"],
    description: "Gives a member a role.",
    usage: "giverole <member> <role>"
};