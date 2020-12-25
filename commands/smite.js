const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    if (!message.member.permissions.has('MUTE_MEMBERS')) return noPerms(message, 'MUTE_MEMBERS');

    let member = message.guild.member(parseUser(client, args[0]));

    if (!member) return message.channel.send('This is not a user id or mention!');
    if (member.permissions.has('MUTE_MEMBERS')) return message.channel.send('You cannot smite other staff!');

    const smiteEmbed = new MessageEmbed()
        .setTitle(`${member.displayName} has been SMITED by ${message.guild.member(message.author).displayName}`)
        .setImage('https://i.imgur.com/iFVsZgp.gif')
        .setColor(embedColor)
        .setFooter('KABLAM!')
        .setTimestamp();
    message.channel.send(smiteEmbed);
}

exports.help = {
    name: 'smite',
    aliases: [],
    description: 'Allows staff to strike a user with the power of thunder!',
    usage: 'smite <user>'
};