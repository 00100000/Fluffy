const { MessageEmbed } = require('discord.js');
const { noPerms } = require('../utils/perms');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    if (noPerms(message, 'EMBED_LINKS', 'SEND_MESSAGES')) return;

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