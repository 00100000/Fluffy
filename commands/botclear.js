const { MessageEmbed } = require('discord.js');
const { noBotPerms, noPerms } = require('../utils/errors');
const { embedColor } = require('../config');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return noPerms(message, 'MANAGE_MESSAGES');
    // command requirements
    let logs = client.channels.cache.get('793637785147801600');
    const botPrefixes = ['!', '?', '&', '-', '>', 'u.', 'pls ', '.', 'd?', '+', '%', 's.'];
    // user issues
    if (!args[0]) args[0] = 25;
    if (isNaN(args[0])) return message.channel.send('You must provide a number of messages for me to clear!');
    if (args[0] > 100 || args[0] < 1) return message.channel.send('You can only clear between 1 and 100 messages!');
    // action
    const botclearEmbed = new MessageEmbed()
        .setTitle('Bot-Related Messages Cleared')
        .addField('Amount of Messages Filtered', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Channel', message.channel.name + `(${message.channel.id})`, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();
    message.channel.messages.fetch({ limit: args[0] }).then(messages => {
        const toClear = messages.filter(m => m.author.bot || botPrefixes.some(p => {
            return (m.content.toLowerCase().startsWith(p));
        }));
        message.channel.bulkDelete(toClear);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${args[0]} bot and bot-related messages cleared.`);
    }).then(() => {
        logs.send(botclearEmbed);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'botclear',
    aliases: ['bc'],
    description: 'Purges bot and bot-related messages from a channel.',
    usage: 'botclear [amount]'
};