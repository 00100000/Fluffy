const { RichEmbed } = require('discord.js');
const { embedColor, owner } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('BAN_MEMBERS')) return noBotPerms(message, 'BAN_MEMBERS');
    if (!message.member.permissions.has('BAN_MEMBERS') && message.author.id !== owner) return noPerms(message, 'BAN_MEMBERS');

    let logs = client.channels.get('790446365762387968');
    let reason = args.slice(1).join(' ');
    let user = message.mentions.members.first();

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
    user.send(`You've been warned by ${message.author.tag}(${message.author.id}), in ${message.guild.name}(${message.guild.id}) for ${reason}.`).then(() => {
        logs.send(warnEmbed);
    });
}

exports.help = {
    name: 'warn',
    aliases: [],
    description: 'Warns a user for a reason and DMs them.',
    usage: 'warn <user> <reason>'
};