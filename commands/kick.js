const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('KICK_MEMBERS')) return noBotPerms(message, 'KICK_MEMBERS');
    if (!message.member.permissions.has('KICK_MEMBERS')) return noPerms(message, 'KICK_MEMBERS');

    let logs = client.channels.get('790446455256252446');
    let reason = args.slice(1).join(' ');
    let user = parseUser(client, args[0]);

    if (!user) return message.channel.send('This is not a user id or mention!');
    if (!reason) reason = 'Disruptive behavior';
    if (!message.guild.member(user).bannable) return message.channel.send('This person is too powerful to be kicked!');

    const kickEmbed = new RichEmbed()
        .setTitle('User Kicked')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('The boot strikes again!')
        .setTimestamp();
    // ban
    user.send(`You've been kicked by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).then(() => {
        logs.send(kickEmbed);
    }).then(() => {
        message.guild.member(user).kick();
    }).then(() => {
        message.channel.send(`Success! ${user.tag} has been kicked.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'kick',
    aliases: ['k'],
    description: 'Kicks a user for a reason and DMs them.',
    usage: 'kick <user> <reason>'
};