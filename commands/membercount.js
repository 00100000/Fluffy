const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    const countEmbed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription('Members: ' + message.guild.members.cache.size)
        .setColor(embedColor)
        .setTimestamp();
    
    message.channel.send(countEmbed).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'membercount',
    aliases: ['members', 'mc'],
    description: 'Tells you how many users are in a guild.',
    usage: 'membercount'
};