const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');

module.exports = (client, member) => {
    let logs = client.channels.get('790446610466209822');

    const removeEmbed = new RichEmbed()
        .setTitle('Remove Event')
        .addField('User', `${member.displayName}(${member.id})`, false)
        .addField('Server', member.guild.name + `(${member.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Bye')
        .setTimestamp();

    logs.send(removeEmbed);
};