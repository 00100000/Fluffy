const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");
const { setupLogs } = require("../utils/setup");

module.exports = async (client, message) => {
    if (!message.content) return;
    if (message.author.bot) return;

    let logs = await setupLogs(message, "event-logs");

    const deleteEmbed = new MessageEmbed()
        .setTitle("Delete Event")
        .addField("Author", message.author, false)
        .addField("Message", message.content, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(deleteEmbed).catch();
};