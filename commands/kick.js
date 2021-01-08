const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('KICK_MEMBERS')) return noBotPerms(message, 'KICK_MEMBERS');
    if (!message.member.permissions.has('KICK_MEMBERS')) return noPerms(message, 'KICK_MEMBERS');
    // command requirements
    let logs = client.channels.cache.get('790446455256252446');
    let reason = args.slice(1).join(' ');
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send('This is not a user id or mention!');
    if (!message.guild.member(user)) return message.channel.send('This user is not in this server!');
    if (!message.guild.member(user).bannable) return message.channel.send('This user is too powerful to be kicked!');
    if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
    }
    if (!reason) reason = 'Disruptive behavior';
    // action
    const kickEmbed = new MessageEmbed()
        .setTitle('User Kicked')
        .addField('User', user.tag, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    
    user.send(`You've been kicked by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).catch(() => {
        message.channel.send('I wasn\'t able to DM this user.');
    });
    logs.send(kickEmbed).then(() => {
        message.guild.member(user).kick();
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${user.tag} has been kicked.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'kick',
    aliases: ['k'],
    description: 'Kicks a user for a reason and DMs them.',
    usage: 'kick <user> <reason>'
};