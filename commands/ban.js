const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('BAN_MEMBERS')) return noBotPerms(message, 'BAN_MEMBERS');
    if (!message.member.permissions.has('BAN_MEMBERS')) return noPerms(message, 'BAN_MEMBERS');

    let logs = client.channels.get('790446465851850794');
    let reason = args.slice(1).join(' ');
    let user = parseUser(client, args[0]);

    if (!user) return message.channel.send('This is not a user id or mention!');
    if (!reason) reason = 'Disruptive behavior';
    if (!message.guild.member(user).bannable) return message.channel.send('This person is too powerful to be banned!');

    const banEmbed = new RichEmbed()
        .setTitle('User Banned')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('The hammer strikes again!')
        .setTimestamp();
    // ban
    user.send(`You've been banned by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).then(() => {
        logs.send(banEmbed);
    }).then(() => {
        message.guild.member(user).ban();
    });
}

exports.help = {
    name: 'ban',
    aliases: [],
    description: 'Bans a user for a reason and DMs them.',
    usage: 'ban <user> <reason>'
};