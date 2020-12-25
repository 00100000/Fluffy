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
    let logs = client.channels.cache.get('790814348519407647');
    let member = message.guild.member(parseUser(client, args[0]));
    let roleToGive = parseRole(member, args.slice(1).join(' '));
    // user issues
    if (!member) return message.channel.send('This is not a member id or mention!');
    if (!roleToGive) return message.channel.send('This is not a valid role, role mention, or role ID.');
    if (member.roles.cache.has(roleToGive.id)) return message.channel.send('This user already has this role!');
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
    }
    if (roleToGive.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t give someone a role higher than or equal to yours!');
    }
    // action
    const giveEmbed = new MessageEmbed()
        .setTitle('Role Given to User')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Role', roleToGive.name, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    member.roles.add(roleToGive).then(() => {
        logs.send(giveEmbed);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${member.user.tag} has been given the role ${roleToGive.name}.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'giverole',
    aliases: ['grole', 'gr'],
    description: 'Gives a member a role.',
    usage: 'giverole <member> <role>'
}