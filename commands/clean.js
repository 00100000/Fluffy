const { MessageEmbed } = require('discord.js');
const { noBotPerms, noPerms } = require('../utils/errors');
const { embedColor } = require('../config');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return noPerms(message, 'MANAGE_MESSAGES');
    // command requirements
    let logs = client.channels.cache.get('793627033913131018');
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send('This is not a user id or mention!');
    if (!message.guild.member(user)) return message.channel.send('This person isn\'t in this server!');
    if (!args[1]) args[1] = 25;
    if (isNaN(args[1])) return message.channel.send('You must provide a number of messages for me to clean!');
    if (args[1] > 100 || args[1] < 1) return message.channel.send('You can only clean between 1 and 100 messages!');
    // action
    const cleanEmbed = new MessageEmbed()
        .setTitle('User Cleaned')
        .addField('Amount of Messages', args[1], false)
        .addField('User', user.tag + `(${message.channel.id})`, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Channel', message.channel.name + `(${message.channel.id})`, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    message.channel.messages.fetch({ limit: args[1] }).then(messages => {
        const toClean = messages.filter(m => m.author.id === user.id);
        message.channel.bulkDelete(toClean);
    }).then(() => {
        logs.send(cleanEmbed);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${args[1]} of ${user.tag}\'s messages have been cleaned.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'clean',
    aliases: ['c'],
    description: 'Purges a user\'s messages from a specific channel.',
    usage: 'clean <user> [amount]'
};