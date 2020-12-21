const { RichEmbed } = require('discord.js');
const { embedColor, owner } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('KICK_MEMBERS')) return noBotPerms(message, 'KICK_MEMBERS');
    if (!message.member.permissions.has('KICK_MEMBERS') && message.author.id !== owner) return noPerms(message, 'KICK_MEMBERS');

    let modlogs = client.channels.get('783520325547196416');
    let reason = args.slice(1).join(' ');
    let user = message.mentions.members.first();

    if (!user) return message.channel.send('You didn\'t provide me with a user to kick!');
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
    user.send(`You've been kicked by ${message.author.tag}(${message.author.id}), in ${message.guild.name}(${message.guild.id}) for ${reason}.`).then(() => {
        modlogs.send(kickEmbed);
    }).then(() => {
        message.guild.member(user).kick();
    });
}

exports.help = {
    name: 'kick',
    aliases: [],
    description: 'Kicks a user for a reason and DMs them.',
    usage: 'kick <user> <reason>'
};