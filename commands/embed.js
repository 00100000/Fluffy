const { MessageEmbed } = require('discord.js');
const { noBotPerms, noPerms } = require('../utils/errors');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    if (!message.member.permissions.has('MANAGE_GUILD')) return noPerms(message, 'MANAGE_GUILD');

    let b = false;
    if (args[0] == 'pink') {
        args = args.slice(1);
        b = true;
    }

    const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(args.join(' '))
        .setColor(b ? '#f775ff' : embedColor)
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