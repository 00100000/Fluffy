const { noPerms } = require("../utils/perms");
const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "EMBED_LINKS", "EMBED_LINKS")) return;

    const inviteEmbed = new MessageEmbed()
        .setTitle("Invite Fluffy!")
        .setDescription(`[With Admin](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)\n[Without Perms](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot)`)
        .setColor(embedColor);

    message.channel.send(inviteEmbed);
}

exports.help = {
    name: "invite",
    aliases: [],
    description: "Get a link to invite Fluffy to your server!",
    usage: "invite"
};