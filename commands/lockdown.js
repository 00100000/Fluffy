const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('ADMINISTRATOR')) return noPerms(message, 'ADMINISTRATOR');
    // command requirements
    let logs = client.channels.cache.get('792819790192050177');
    // action
    const lockdownEmbed = new MessageEmbed()
        .setTitle('Lockdown')
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(lockdownEmbed).then(() => {
        message.guild.channels.cache.forEach(channel => {
            channel.updateOverwrite(message.guild.roles.everyone ,{
                'SEND_MESSAGES': false
            });
        });
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${message.guild.name} has been locked down.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'lockdown',
    aliases: ['ld'],
    description: 'Locks down the server.',
    usage: 'lockdown'
};