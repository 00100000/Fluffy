const { MessageEmbed } = require('discord.js');
const { noBotPerms, noPerms } = require('../utils/errors');
const { jsonReadFile, jsonWriteFile } = require('../utils/file');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('ADMINISTRATOR')) return noPerms(message, 'ADMINISTRATOR');
    // command requirements
    let logs = client.channels.cache.get('792819832818368552');
    // action
    const endlockdownEmbed = new MessageEmbed()
        .setTitle('Lockdown Ended')
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    logs.send(endlockdownEmbed).then(async () => {
        let lockedDownPerms = await jsonReadFile("lockdown.json");
        const guildID = message.guild.id;

        message.guild.channels.cache.forEach(async channel => {
            // brain death
            if (lockedDownPerms?.[guildID]?.[channel.id] !== undefined) {
                channel.updateOverwrite(message.guild.roles.everyone, {
                    'SEND_MESSAGES': lockedDownPerms[guildID][channel.id]
                });
                    
                delete lockedDownPerms[guildID][channel.id];
            }
        });

        await jsonWriteFile("lockdown.json", lockedDownPerms);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> The lockdown in ${message.guild.name} has been ended.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'unlockdown',
    aliases: ['uld'],
    description: 'Ends a lockdown.',
    usage: 'unlockdown'
};