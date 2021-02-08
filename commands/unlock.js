const { MessageEmbed } = require('discord.js');
const { parseChannel } = require('../utils/parse');
const { noBotPerms, noPerms } = require('../utils/errors');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_CHANNELS')) return noBotPerms(message, 'MANAGE_CHANNELS');
    if (!message.member.permissions.has('MANAGE_CHANNELS')) return noPerms(message, 'MANAGE_CHANNELS');
    // command requirements
    let logs = client.channels.cache.get('792819756176113675');
    let channel = parseChannel(message, args[0]);
    if (!channel) channel = message.channel;
    // user issues
    if (!channel.isText()) return message.channel.send('You can only use this on a text channel!');
    // action
    const lockEmbed = new MessageEmbed()
        .setTitle('Channel Unlocked')
        .addField('Channel', channel.name, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(lockEmbed).then(() => {
        channel.updateOverwrite(message.guild.roles.everyone ,{
            'SEND_MESSAGES': true
        });
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> #${channel.name} has been unlocked.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'unlock',
    aliases: ['ul'],
    description: 'Unlocks a channel in a server.',
    usage: 'unlock [channel]'
};