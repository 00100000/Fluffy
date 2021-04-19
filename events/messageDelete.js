const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");
const { setupLogs } = require("../utils/setup");

module.exports = (client, message) => {
    let logs = setupLogs(message, "event-logs");

    if (!message.content) return;
    if (message.author.bot) return;

    const deleteEmbed = new MessageEmbed()
        .setTitle("Delete Event")
        .addField("Author", message.author, false)
        .addField("Message", message.content, false)
        .addField("Server", message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter("Alt + F4")
        .setTimestamp();

    logs.send(deleteEmbed).catch();
};