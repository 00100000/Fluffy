const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');

module.exports = (client, messageReaction, user) => {
    let actionlogs = client.channels.get('783520521236906005');

    const removeEmbed = new RichEmbed()
        .setTitle('Reaction Remove Event')
        .addField('User Removing Reaction', `<@${user.id}>`, false)
        .addField('Reaction', messageReaction.emoji, false)
        .addField('Message Content', messageReaction.message.content, false)
        .addField('Message ID', messageReaction.message.id, false)
        .addField('Server', messageReaction.message.guild.name + `(${messageReaction.message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Unclick')
        .setTimestamp();

    actionlogs.send(removeEmbed);
};