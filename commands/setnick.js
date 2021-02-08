const { MessageEmbed } = require('discord.js');
const { parseUser } = require('../utils/parse');
const { noBotPerms, noPerms } = require('../utils/errors');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_NICKNAMES')) return noBotPerms(message, 'MANAGE_NICKNAMES');
    if (!message.member.permissions.has('MANAGE_NICKNAMES')) return noPerms(message, 'MANAGE_NICKNAMES');
    // command requirements
    let logs = client.channels.cache.get('790650641429168167');
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send('This is not a user id or mention!');
    if (!message.guild.member(user)) return message.channel.send('This user is not in this server!');
    let newNick = args.slice(1).join(' ');
    let oldNick = message.guild.member(user).displayName;
    if (!newNick) return message.channel.send('You didn\'t tell me what you want the new nickname to be!');
    if (newNick.length > 32) return message.channel.send('The nickname must be less than 32 characters long!');
    if (!message.guild.member(user).bannable) return message.channel.send('This user is too powerful to have their nickname changed!');
    if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
    }
    // action
    const nickEmbed = new MessageEmbed()
        .setTitle('Moderator Changed A User\'s Nickame')
        .addField('User', user.tag, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Old Nickname', oldNick, false)
        .addField('New Nickname', newNick, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    // change nick
    message.guild.member(user).setNickname(newNick).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${user.tag}'s New Nickname: ${newNick}`);
    }).then(() => {
        logs.send(nickEmbed);
    });
};

exports.help = {
    name: 'setnick',
    aliases: ['nick', 'sn'],
    description: 'For changing naughty nicknames on mobile, and keeping track of them.',
    usage: 'setnick <user> <new nickname>'
};