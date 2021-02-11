const { MessageEmbed } = require('discord.js');
const { noPerms } = require('../utils/perms');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    if (noPerms(message, 'EMBED_LINKS', 'SEND_MESSAGES')) return;

    if (!client.lastDeletedMessageInfo) return message.channel.send('There\'s nothing to snipe!');
    // action
    try {
        const snipeEmbed = new MessageEmbed()
            .setAuthor(client.lastDeletedMessageInfo.author.tag, client.lastDeletedMessageInfo.author.avatarURL())
            .setDescription(client.lastDeletedMessageInfo.content)
            .setColor(embedColor)
            .setTimestamp();
        message.channel.send(snipeEmbed);
    } catch (e) {
        message.channel.send(`\`\`\`${e}\`\`\``);
    }
};

exports.help = {
    name: 'snipe',
    aliases: [],
    description: 'Shows the last deleted message.',
    usage: 'snipe'
};