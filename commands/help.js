const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');
const { owner, prefix, embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    let cmds = Array.from(client.commands.keys());
    let cmd = args[0];

    if (cmd) {

        let cmdObj = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!cmdObj) return;
        let cmdHelp = cmdObj.help;

        let cmdHelpEmbed = new MessageEmbed()
            .setTitle(`${cmdHelp.name} Command`)
            .setDescription(cmdHelp.description)
            .addField('Usage', `\`${prefix}${cmdHelp.usage}\``, true)
            .setColor(embedColor);

        if (cmdHelp.aliases.length) cmdHelpEmbed.addField('Aliases', `\`${cmdHelp.aliases.join(', ')}\``, true);

        return message.channel.send(cmdHelpEmbed);
    }

    const helpCmds = cmds.map(cmd => {
        return '`' + cmd + '`';
    });

    const helpEmbed = new MessageEmbed()
        .setTitle('Help Information')
        .setDescription(`View help information for ${client.user}. \n (Do \`${prefix}help [command]\` for specific help information).`)
        .addField('Current Prefix', prefix)
        .addField('Bot Commands', helpCmds.join(' | '))
        .addField('Found an issue?', `Please report any issues to ${owner}`)
        .setColor(embedColor)
        .setFooter(`Made with <3 and discord.js by 00100000#0032`)
        .setTimestamp();

    message.channel.send(helpEmbed).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'help',
    aliases: ['h'],
    description: 'View all commands and where to receive bot support.',
    usage: 'help <command>'
};