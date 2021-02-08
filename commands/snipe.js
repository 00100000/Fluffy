const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    // if no message
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