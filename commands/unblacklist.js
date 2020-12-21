const { blacklist } = require('../data.json');
const { owner } = require('../config');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('SEND_MESSAGES')) return noBotPerms(message, 'SEND_MESSAGES');

    if (message.author.id !== owner) return message.channel.send('Only the owner of this bot may use this command!');
    if (!blacklist.includes(args[0])) return message.channel.send('This person isn\'t blacklisted!');

    blacklist.splice(blacklist.indexOf(args[0]), 1);
    message.channel.send(args[0] + ' has been removed from the blacklist');
};

exports.help = {
    name: 'unblacklist',
    aliases: ['ub'],
    description: 'Unblacklists someone from using this bot.',
    usage: 'b <id>'
};