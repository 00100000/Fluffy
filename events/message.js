const { blacklist } = require('../blacklist.json');
const { prefix, whitelistedChannel } = require('../config.json');

module.exports = async (client, message) => {
    // DMs and bots
    if (!message.guild) return;
    if (message.author.bot) return;
    // filter
    const naughties = ['https:', 'dsc.gg', 'discord.gg', 'nigg', 'fagg'];

    if (naughties.some(s => message.content.toLowerCase().includes(s))
    && !message.guild.member(message.author).permissions.has('EMBED_LINKS')
    && message.channel.id !== whitelistedChannel) {
        return message.delete();
    }

    if (!message.content.startsWith(prefix)) return;
    // command and args parsing
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // aliases
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // check if valid command or blacklisted author
    if (!cmd) return;
    if (blacklist.includes(message.author.id)) return;
    // execute command
    cmd.run(client, message, args);
};