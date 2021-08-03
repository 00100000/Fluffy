const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");

exports.run = async (client, message, args) => {
    if (noPerms(message, "EMBED_LINKS", "SEND_MESSAGES")) return;

    let user = undefined;
    if (args[0]) {
        user = parseUser(client, args[0]);
    } else {
        user = message.author;
    }

    let avatarEmbed = new MessageEmbed()
        .setTitle(user.tag + "'s Avatar")
        .setImage(user.avatarURL({ format: "png", dynamic: true, size: 4096 }))
        .setColor(embedColor);

    message.channel.send(avatarEmbed);
};

exports.help = {
    name: "avatar",
    aliases: ["av"],
    description: "Displays a user's avatar",
    usage: "av [member]"
};
