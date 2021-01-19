const { prefix } = require('../config');
const { jsonReadFile } = require('../utils/file');

module.exports = async (client, message) => {
    const blacklist = await jsonReadFile('./blacklist.json');
    // DMs and bots
    if (!message.guild) return;
    if (message.author.bot) return;
    // filter
    const naughties = ['https:', 'dsc.gg', 'discord.gg'];
    if (naughties.some(s => message.content.toLowerCase().includes(s)) && !message.guild.member(message.author).permissions.has('EMBED_LINKS') && message.channel.id != '797666779731329074') {
        return message.delete();
    }

    // commands
    if (!message.content.startsWith(prefix)) return;
    // command and args
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // aliases
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    
    if (!cmd) return;
    if (blacklist.blacklist.includes(message.author.id)) return message.channel.send('You are not allowed to use this bot 😘');
    
    cmd.run(client, message, args);
};