const { prefix } = require('../config');
const { blacklist } = require('../data.json');

module.exports = async (client, message) => {
    const naughties = ['https:', 'dsc.gg', 'discord.gg'];
    if (!message.guild) return;
    if (blacklist.includes(message.author.id)) return;
    if (naughties.some(s => message.content.toLowerCase().includes(s)) && !message.author.permissions.has('MANAGE_GUILD') && message.channel.id != '774142671249211403') {
        return message.delete();
    }

    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const newPrefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

    const getPrefix = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(getPrefix)) return message.channel.send(`My Prefix is: \`${prefix}\``);

    if (message.author.bot) return;
    if (message.content.indexOf(newPrefix) !== 0) return;

    const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    cmd.run(client, message, args);
};