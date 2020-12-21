const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('BAN_MEMBERS')) return noBotPerms(message, 'BAN_MEMBERS');
    if (!message.member.permissions.has('MANAGE_NICKNAMES')) return noPerms(message, 'MANAGE_NICKNAMES');

    let logs = client.channels.get('790446365762387968');
    let reason = args.slice(1).join(' ');
    let user = parseUser(client, args[0]);

    if (!user) return message.channel.send('You didn\'t provide me with a user to warn!');
    if (!reason) reason = 'Disruptive behavior';
    if (!message.guild.member(user).bannable) return message.channel.send('This person is too powerful to be warned!');

    const warnEmbed = new RichEmbed()
        .setTitle('User Warned')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Naughty naughty!')
        .setTimestamp();
    // ban
    user.send(`You've been warned by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).then(() => {
        logs.send(warnEmbed);
    }).then(() => {
        message.channel.send(`Success! ${user.tag} has been warned for \`${reason}\`.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'warn',
    aliases: ['w'],
    description: 'Warns a user for a reason and DMs them.',
    usage: 'warn <user> <reason>'
};