const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    if (!message.member.permissions.has('MANAGE_GUILD')) return noPerms(message, 'MANAGE_GUILD');

    let b = false;
    if (args[0] == 'pink') {
        args = args.slice(1);
        b = true;
    }

    const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setDescription(args.join(' '))
        .setColor(b ? '#f775ff' : embedColor)
        .setTimestamp();
    
    message.channel.send(embed).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'embed',
    aliases: ['em'],
    description: 'Creates a sexy embed out of a message.',
    usage: 'embed <content>'
};