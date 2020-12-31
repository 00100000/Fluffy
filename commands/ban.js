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
    let logs = client.channels.cache.get('790446465851850794');
    let reason = args.slice(1).join(' ');
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send('This is not a user id or mention!');
    if (message.guild.member(user)) {
        if (!message.guild.member(user).bannable) return message.channel.send('This user is too powerful to be banned!');
        if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
            return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
        }
    }
    if (!reason) reason = 'Disruptive behavior';
    // action
    const banEmbed = new MessageEmbed()
        .setTitle('User Banned')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    user.send(`You've been banned by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).catch(() => {
        message.channel.send('I wasn\'t able to DM this user.');
    });
    logs.send(banEmbed).then(() => {
        message.guild.members.ban(user, { reason: reason });
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${user.tag} has been banned.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'ban',
    aliases: ['b'],
    description: 'Bans a user for a reason and DMs them.',
    usage: 'ban <user> <reason>'
};