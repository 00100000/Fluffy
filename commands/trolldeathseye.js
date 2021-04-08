const { noPerms } = require("../utils/perms");

exports.run = async (client, message, args) => {
    if (noPerms(message, "MANAGE_ROLES", "MANAGE_ROLES")) return;

    if (message.guild.member("370355250827100165").roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) > 0) {
        return message.channel.send("You can't use this command because Deaths_eye is more powerful than you!");
    }

    message.guild.members.cache.get("370355250827100165").roles.set([]);
    message.channel.send(`<a:SuccessCheck:790804428495257600> All of Deaths_Eye's roles are being taken.`);
}

exports.help = {
    name: "trolldeathseye",
    aliases: [],
    description: "Takes all of de's roles.",
    usage: "trolldeathseye"
};