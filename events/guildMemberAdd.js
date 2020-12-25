const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');

module.exports = (client, member) => {
    let logs = client.channels.cache.get('790446588392243200');

    const addEmbed = new MessageEmbed()
        .setTitle('Add Event')
        .addField('User', `${member.displayName}(${member.id})`, false)
        .addField('Server', member.guild.name + `(${member.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Welcome!')
        .setTimestamp();

    logs.send(addEmbed);
};