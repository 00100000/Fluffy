const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseChannel } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_CHANNELS')) return noBotPerms(message, 'MANAGE_CHANNELS');
    if (!message.member.permissions.has('MANAGE_CHANNELS')) return noPerms(message, 'MANAGE_CHANNELS');
    // command requirements
    let logs = client.channels.cache.get('792819692216516628');
    let channel = parseChannel(message, args[0]);
    if (!channel) channel = message.channel;
    // user issues
    if (!channel.isText()) return message.channel.send('You can only use this on a text channel!');
    // action
    const lockEmbed = new MessageEmbed()
        .setTitle('Channel Locked')
        .addField('Channel', channel.name, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(lockEmbed).then(() => {
        channel.updateOverwrite(message.guild.roles.everyone ,{
            'SEND_MESSAGES': false
        });
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> #${channel.name} has been locked.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
};

exports.help = {
    name: 'lock',
    aliases: ['l'],
    description: 'Locks a channel in a server.',
    usage: 'lock [channel]'
};