const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');

module.exports = (client, message) => {
    let logs = client.channels.get('790446481492017192');

    if (!message.content) return;

    const deleteEmbed = new RichEmbed()
        .setTitle('Delete Event')
        .addField('Author', message.author, false)
        .addField('Message', message.content, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Alt + F4')
        .setTimestamp();

    logs.send(deleteEmbed);
};