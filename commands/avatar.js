const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");

exports.run = async (client, message, args) => {
    if (noPerms(message, "EMBED_LINKS", "SEND_MESSAGES")) return;

    let member = undefined;
    if (args[0]) {
        member = parseUser(client, args[0]);
    } else {
        member = message.author;
    }

    let avatarEmbed = new MessageEmbed()
        .setTitle(member.user.tag + "'s Avatar")
        .setImage(member.avatarURL({ format: "png", dynamic: true, size: 4096 }))
        .setColor(embedColor)
        .setTimestamp();
    message.channel.send(avatarEmbed);
};

exports.help = {
    name: "avatar",
    aliases: ["av"],
    description: "Shows a user's avatar",
    usage: "av [member]"
};