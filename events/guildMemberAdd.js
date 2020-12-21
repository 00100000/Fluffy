const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');

module.exports = (client, member) => {
    let actionlogs = client.channels.get('783520521236906005');

    const addEmbed = new RichEmbed()
        .setTitle('Add Event')
        .addField('User', `${member.displayName}(${member.id})`, false)
        .addField('Server', member.guild.name + `(${member.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Welcome!')
        .setTimestamp();

    const joinEmbed = new RichEmbed()
        .setTitle('Welcome to the FRC Team 2638 Discord')
        .setDescription('One of our "Welcome Guys" will help you get started soon.' +
        ' Your nickname in this server should be your full first and last name.' +
        ' Welcome to the team!')
        .addField('Website', 'https://www.gnsrobotics.com', true)
        .addField('Discord', 'https://discord.com/invite/KCyEz3u', true)
        .setColor(embedColor)
        .setFooter('Made with <3 and discord.js by 00100000#0901')
        .setTimestamp();

    if (member.guild.id == '372395474877022218') {
        actionlogs.send(addEmbed).then(() => {
            member.send(joinEmbed);
        });
    }
};