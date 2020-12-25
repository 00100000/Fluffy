const { prefix } = require('../config');
const { blacklist } = require('../data.json');

module.exports = async (client, message) => {

    if (!message.guild) return;
    if (blacklist.includes(message.author.id)) return;

    // FILTER
    if (message.content.includes('https://') && !message.guild.member(message.author).hasPermission('EMBED_LINKS')) message.delete();
    // FILTER

    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const newPrefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

    const getPrefix = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(getPrefix)) return message.channel.send(`My prefix in this guild is \`${prefix}\``);

    if (message.author.bot) return;
    if (message.content.indexOf(newPrefix) !== 0) return;

    const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.cache.get(command) || client.commands.cache.get(client.aliases.cache.get(command));
    if (!cmd) return;

    cmd.run(client, message, args);
};