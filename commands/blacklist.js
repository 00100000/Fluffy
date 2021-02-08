const { parseUser } = require('../utils/parse');
const { noBotPerms } = require('../utils/errors');
const { jsonReadFile, jsonWriteFile } = require('../utils/file');
const { owner } = require('../config.json');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('SEND_MESSAGES')) return noBotPerms(message, 'SEND_MESSAGES');
    if (message.author.id !== owner) return message.channel.send('Only the owner of this bot may use this command!');
    // command requirements
    let user = parseUser(client, args[0]);
    // user issues
    if (!user) return message.channel.send('This user doesn\'t share any guilds with the bot!');
    // action
    const blacklist = await jsonReadFile('./blacklist.json');
    try {
        blacklist.blacklist.push(args[0]);
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${args[0]} has been added to the blacklist.`);
        jsonWriteFile('./blacklist.json', blacklist);
    } catch (e) {
        message.channel.send(`\`\`\`${e}\`\`\``);
    }
};

exports.help = {
    name: 'blacklist',
    aliases: [],
    description: 'Bans someone from using this bot.',
    usage: 'blacklist <id>'
};