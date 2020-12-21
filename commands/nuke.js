const { RichEmbed } = require('discord.js');
const { embedColor, owner } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    message.delete();

    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('ADMINISTRATOR') && message.author.id !== owner) return noPerms(message, 'ADMINISTRATOR');

    let modlogs = client.channels.get('783520325547196416');
    if (!args[0]) return message.author.send('You didn\'t tell me how many messages to nuke!');

    const nukeEmbed = new RichEmbed()
        .setTitle('Nuked!')
        .addField('Amount of Messages', args[0], false)
        .addField('Channel', message.channel.name + `(${message.channel.id})`, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Begone, messages!')
        .setTimestamp();
    // nuke event
    message.channel.bulkDelete(args[0], true).then(() => {
        modlogs.send(nukeEmbed);
    });
}

exports.help = {
    name: 'nuke',
    aliases: [],
    description: 'Purges up to 100 messages from a channel.',
    usage: 'nuke <amount>'
}