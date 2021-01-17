const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { jsonReadFile, jsonWriteFile } = require('../utils/file');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('ADMINISTRATOR')) return noPerms(message, 'ADMINISTRATOR');
    // command requirements
    let logs = client.channels.cache.get('792819790192050177');
    // action
    const lockdownEmbed = new MessageEmbed()
        .setTitle('Lockdown')
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    

    logs.send(lockdownEmbed).then(async () => {
        let lockedDownPerms = await jsonReadFile("lockdown.json");
        const guildID = message.guild.id;

        message.guild.channels.cache.filter(channel => channel.type === 'text').forEach(async channel => {
            // read file, if the guild doesn't exist make it an object
            // each channel has either true, or false as the value.
            const perms = channel.permissionsFor(message.guild.roles.everyone).serialize();

            lockedDownPerms[guildID] = lockedDownPerms[guildID] || {};
            lockedDownPerms[guildID][channel.id] = perms["SEND_MESSAGES"];

            channel.updateOverwrite(message.guild.roles.everyone ,{
                'SEND_MESSAGES': false
            });
        });

        await jsonWriteFile("lockdown.json", lockedDownPerms);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${message.guild.name} has been locked down.`);
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'lockdown',
    aliases: ['ld'],
    description: 'Locks down the server.',
    usage: 'lockdown'
};