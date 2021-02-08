const { noBotPerms } = require('../utils/errors');
const { jsonReadFile, jsonWriteFile } = require('../utils/file');
const { owner } = require('../config.json');

exports.run = async (client, message, args) => {
    const blacklist = await jsonReadFile('./blacklist.json');
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('SEND_MESSAGES')) return noBotPerms(message, 'SEND_MESSAGES');
    if (message.author.id !== owner) return message.channel.send('Only the owner of this bot may use this command!');
    // user issues
    if (!blacklist.blacklist.includes(args[0])) return message.channel.send('This user isn\'t blacklisted!');
    // action
    try {
        blacklist.blacklist.splice(blacklist.blacklist.indexOf(args[0]), 1);
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${args[0]} has been removed from the blacklist.`);
        jsonWriteFile('./blacklist.json', blacklist);
    } catch (e) {
        message.channel.send(`\`\`\`${e}\`\`\``);
    }
};

exports.help = {
    name: 'unblacklist',
    aliases: [],
    description: 'Unblacklists someone from using this bot.',
    usage: 'unblacklist <id>'
};