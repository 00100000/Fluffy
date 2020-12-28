const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('BAN_MEMBERS')) return noBotPerms(message, 'BAN_MEMBERS');
    if (!message.member.permissions.has('BAN_MEMBERS')) return noPerms(message, 'BAN_MEMBERS');
    // command requirements
    let logs = client.channels.cache.get('790485234968821791');
    let reason = args.slice(1).join(' ');
    // user issues
    if (!args[0]) return message.channel.send('You didn\'t provide me with a user to unban!');
    if(!reason) reason = 'Served punishment.';
    // action
    const unbanEmbed = new MessageEmbed()
        .setTitle('User Unbanned')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    message.guild.members.unban(args[0]).then(() => {
        logs.send(unbanEmbed);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${parseUser(client, args[0]).tag} has been unbanned.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
};

exports.help = {
    name: 'unban',
    aliases: ['ub'],
    description: 'Unbans a user for a reason and DMs them.',
    usage: 'unban <user> <reason>'
};