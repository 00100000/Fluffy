const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');

module.exports = (client, oldMessage, newMessage) => {
    let actionlogs = client.channels.get('783520521236906005');

    if (newMessage.content === oldMessage.content) return;

    const updateEmbed = new RichEmbed()
        .setTitle('Edit Event')
        .addField('User', oldMessage.author, false)
        .addField('Original Message', oldMessage.content, false)
        .addField('New Message', newMessage.content, false)
        .addField('Server', oldMessage.guild.name + `(${oldMessage.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Sneaky edit')
        .setTimestamp();

    actionlogs.send(updateEmbed);
};