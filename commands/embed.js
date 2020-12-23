const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setDescription(message.content.slice(7))
        .setColor(embedColor)
        .setTimestamp();
    
    message.channel.send(embed).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'embed',
    aliases: [],
    description: 'Creates a sexy embed out of a message.',
    usage: 'embed <content>'
};