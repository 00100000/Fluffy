const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');

module.exports = (client, member) => {
    let actionlogs = client.channels.get('783520521236906005');

    const removeEmbed = new RichEmbed()
        .setTitle('Remove Event')
        .addField('User', `${member.displayName}(${member.id})`, false)
        .addField('Server', member.guild.name + `(${member.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Bye')
        .setTimestamp();

    actionlogs.send(removeEmbed);
};