const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config.json');

module.exports = (client, messageReaction, user) => {
    let logs = client.channels.cache.get('790446570445209600');

    const removeEmbed = new MessageEmbed()
        .setTitle('Reaction Remove Event')
        .addField('User Who Reacted', `<@${user.id}>`, false)
        .addField('Reaction', messageReaction.emoji, false)
        .addField('Message Content', messageReaction.message.content, false)
        .addField('Message ID', messageReaction.message.id, false)
        .addField('Server', messageReaction.message.guild.name + `(${messageReaction.message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Unclick')
        .setTimestamp();

    logs.send(removeEmbed);
};