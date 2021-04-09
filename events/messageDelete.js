const { MessageEmbed } = require("discord.js");
const { embedColor, deleteEventChannel } = require("../config.json");

module.exports = (client, message) => {
    let logs = client.channels.cache.get(deleteEventChannel);

    if (!message.content) return;
    if (message.author.bot) return;

    // SNIPE
    if (message.guild.id === mainGuild) client.lastDeletedMessageInfo = message;

    const deleteEmbed = new MessageEmbed()
        .setTitle("Delete Event")
        .addField("Author", message.author, false)
        .addField("Message", message.content, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter("Alt + F4")
        .setTimestamp();

    logs.send(deleteEmbed);
};