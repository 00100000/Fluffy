const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('BAN_MEMBERS')) return noBotPerms(message, 'BAN_MEMBERS');
    if (!message.member.permissions.has('MANAGE_NICKNAMES')) return noPerms(message, 'MANAGE_NICKNAMES');
    // command requirements
    let logs = client.channels.cache.get('790446365762387968');
    let reason = args.slice(1).join(' ');
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send('You didn\'t provide me with a user to warn!');
    if (!message.guild.member(user)) return message.channel.send('This user is not in this server!');
    if (!message.guild.member(user).bannable) return message.channel.send('This user is too powerful to be warned!');
    if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
    }
    if (!reason) reason = 'Disruptive behavior';
    // action
    const warnEmbed = new MessageEmbed()
        .setTitle('User Warned')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Naughty naughty!')
        .setTimestamp();

    user.send(`You've been warned by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).catch(() => {
        message.channel.send('I wasn\'t able to DM this user.');
    });
    logs.send(warnEmbed).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${user.tag} has been warned for \`${reason}\`.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
};

exports.help = {
    name: 'warn',
    aliases: ['w'],
    description: 'Warns a user.',
    usage: 'warn <user> <reason>'
};