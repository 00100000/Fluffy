const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser, parseRole } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_ROLES')) return noBotPerms(message, 'MANAGE_ROLES');
    if (!message.member.permissions.has('MANAGE_ROLES')) return noPerms(message, 'MANAGE_ROLES');
    // command requirements
    let logs = client.channels.cache.get('790814385702174750');
    let member = message.guild.member(parseUser(client, args[0]));
    if (!member) return message.channel.send('This is not a member id or mention!');
    let roleToTake = parseRole(member, args.slice(1).join(' '));
    // user issues
    if (!roleToTake) return message.channel.send('This is not a valid role, role mention, or role ID.');
    if (!member.roles.cache.has(roleToTake.id)) return message.channel.send('This user doesn\'t have this role!');
    if (member.roles.cache.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
    }
    if (roleToTake.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t take a role higher than or equal to yours!');
    }
    // action
    const takeEmbed = new MessageEmbed()
        .setTitle('Role Taken From User')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Role', roleToTake.name, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    member.roles.remove(roleToTake).then(() => {
        logs.send(takeEmbed);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${roleToTake.name} has been taken from ${member.user.tag}.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'takerole',
    aliases: ['trole', 'tr'],
    description: 'Takes a role from a member.',
    usage: 'takerole <member> <role>'
}