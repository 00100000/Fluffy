const { MessageEmbed } = require('discord.js');
const { noPerms } = require('../utils/perms');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    if (noPerms(message, 'EMBED_LINKS', 'MANAGE_GUILD')) return;

    const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(args.join(' '))
        .setColor(embedColor)
        .setTimestamp();
    
    message.channel.send(embed).then(() => {
        message.delete();
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });;
};

exports.help = {
    name: 'embed',
    aliases: ['em'],
    description: 'Creates a sexy embed out of a message.',
    usage: 'embed <content>'
};