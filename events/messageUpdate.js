const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../config.json");
const { setupLogs } = require("../utils/setup");

module.exports = async (client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (newMessage.content === oldMessage.content) return;
    if (!newMessage.content || !oldMessage.content) return;
    if (!newMessage.guild.me.permissions.has("ADMINISTRATOR")) return;

    let logs = await setupLogs(newMessage, "event-logs");

    if (logs) {
        const updateEmbed = new MessageEmbed()
            .setTitle("Edit Event")
            .addField("User", oldMessage.author, false)
			.addField("Channel", `<#${oldMessage.channel.id}>`, false)
            .addField("Original Message", oldMessage.content, false)
            .addField("New Message", newMessage.content, false)
            .setColor(embedColor);

        logs.send(updateEmbed);
    }
}