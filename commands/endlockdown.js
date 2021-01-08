const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('ADMINISTRATOR')) return noPerms(message, 'ADMINISTRATOR');
    // command requirements
    let logs = client.channels.cache.get('792819832818368552');
    // action
    const endlockdownEmbed = new MessageEmbed()
        .setTitle('Lockdown Ended')
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(endlockdownEmbed).then(() => {
        message.guild.channels.cache.forEach(channel => {
            channel.updateOverwrite(message.guild.roles.everyone ,{
                'SEND_MESSAGES': true
            });
        });
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> The lockdown in ${message.guild.name} has been ended.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });;
};

exports.help = {
    name: 'endlockdown',
    aliases: ['eld'],
    description: 'Ends a lockdown.',
    usage: 'endlockdown'
};