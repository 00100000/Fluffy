const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser, parseRole } = require("../utils/parse");
const { embedColor } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    let logs = client.channels.cache.get("790814385702174750");
    let member = message.guild.member(parseUser(client, args[0]));
    if (!member) return message.channel.send("This is not a member id or mention!");
    let roleToTake = parseRole(member, args.slice(1).join(" "));
    // user issues
    if (!roleToTake) return message.channel.send("This is not a valid role, role mention, or role ID.");
    if (!member.roles.cache.has(roleToTake.id)) return message.channel.send("This user doesn't have this role!");
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't use this command on someone more or just as powerful as you!");
    }
    if (roleToTake.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send("You can't take a role higher than or equal to yours!");
    }
    // action
    const takeEmbed = new MessageEmbed()
        .setTitle("Role Taken From User")
        .addField("User", member.user.tag, false)
        .addField("Moderator", message.author.tag, false)
        .addField("Role", roleToTake.name, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    member.roles.remove(roleToTake).then(() => {
        logs.send(takeEmbed);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${roleToTake.name} has been taken from ${member.user.tag}.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: "takerole",
    aliases: ["trole", "tr"],
    description: "Takes a role from a member.",
    usage: "takerole <member> <role>"
};