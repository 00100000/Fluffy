const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");
const { setupLogs } = require("../utils/setup");

module.exports = (client, oldMessage, newMessage) => {
    let logs = setupLogs(message, "event-logs");
    
    if (oldMessage.author.bot) return;
    if (newMessage.content === oldMessage.content) return;

    const updateEmbed = new MessageEmbed()
        .setTitle("Edit Event")
        .addField("User", oldMessage.author, false)
        .addField("Original Message", oldMessage.content, false)
        .addField("New Message", newMessage.content, false)
        .addField("Server", oldMessage.guild.name + `(${oldMessage.guild.id})`, false)
        .setColor(embedColor)
        .setFooter("Sneaky edit")
        .setTimestamp();

    logs.send(updateEmbed).catch();
};