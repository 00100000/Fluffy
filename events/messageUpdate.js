const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");
const { setupLogs } = require("../utils/setup");

module.exports = async (client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (newMessage.content === oldMessage.content) return;
    if (!newMessage.guild.me.permissions.has("ADMINISTRATOR")) return;

    let logs = await setupLogs(newMessage, "event-logs");

    const updateEmbed = new MessageEmbed()
        .setTitle("Edit Event")
        .addField("User", oldMessage.author, false)
        .addField("Original Message", oldMessage.content, false)
        .addField("New Message", newMessage.content, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(updateEmbed).catch();
};