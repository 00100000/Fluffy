const { RichEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    let user = message.mentions.members.first();

    if (!user) return message.channel.send('You didn\'t provide me with a user to analyze!');

    let color = message.guild.member(user).displayHexColor;
    let colorB = message.guild.member(user).displayColor;

    const colorEmbed = new RichEmbed()
        .setTitle('Color Profile')
        .addField('User', args[0], false)
        .addField('Hex Color', color, false)
        .addField('Base 10 Color', colorB, false)
        .setColor(color)
        .setFooter('Fancy!')
        .setTimestamp();
    
    message.channel.send(colorEmbed);
}

exports.help = {
    name: 'color',
    aliases: [],
    description: 'Returns the base 10 and hex value of a user\'s color in a guild',
    usage: 'color <user>'
};