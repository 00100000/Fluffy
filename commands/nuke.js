const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('ADMINISTRATOR')) return noPerms(message, 'ADMINISTRATOR');

    let logs = client.channels.cache.get('790446527281627176');
    if (!args[0]) return message.channel.send('You didn\'t tell me how many messages to nuke!');
    if (args[0] > 100 || args[0] < 1) return message.channel.send('You can only nuke between 1 and 100 messages!');

    const nukeEmbed = new MessageEmbed()
        .setTitle('Nuked!')
        .addField('Amount of Messages', args[0], false)
        .addField('Channel', message.channel.name + `(${message.channel.id})`, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Begone, messages!')
        .setTimestamp();
    // nuke event
    message.delete().then(() => {
        message.channel.bulkDelete(args[0], true);
    }).then(() => {
        logs.send(nukeEmbed);
    });
}

exports.help = {
    name: 'nuke',
    aliases: ['n'],
    description: 'Purges up to 100 messages from a channel.',
    usage: 'nuke <amount>'
}