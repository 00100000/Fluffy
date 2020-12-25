const { blacklist } = require('../data.json');
const { owner } = require('../config');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('SEND_MESSAGES')) return noBotPerms(message, 'SEND_MESSAGES');

    if (message.author.id !== owner) return message.channel.send('Only the owner of this bot may use this command!');

    blacklist.push(args[0]);
    message.channel.send(args[0] + ' has been added to the blacklist');
};

exports.help = {
    name: 'blacklist',
    aliases: [],
    description: 'Bans someone from using this bot.',
    usage: 'b <id>'
};