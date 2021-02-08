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
    let logs = client.channels.cache.get('792819790192050177');
    // action
    const lockdownEmbed = new MessageEmbed()
        .setTitle('Lockdown')
        .addField('Moderator', message.author.tag, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    
    let lockedDownPerms = await jsonReadFile("lockdown.json");
    const guildID = message.guild.id;

    lockedDownPerms[guildID] = lockedDownPerms[guildID] || {};

    // if the guild is already in a lockdown, wait until they unlockdown first.
    if (Object.keys(lockedDownPerms[guildID]).length) {
        await jsonWriteFile("lockdown.json", lockedDownPerms);
        return message.channel.send("The guild is already in lockdown! Use `?unlockdown`.");
    }
        
    logs.send(lockdownEmbed).then(async () => {
        message.guild.channels.cache.filter(channel => channel.type === 'text').forEach(async channel => {
            // https://discord.js.org/#/docs/main/stable/class/PermissionOverwrites
            const perms = channel.permissionOverwrites.find(p => p.id === ("" + message.guild.roles.everyone));
            // true (allowed), false (denied), null (neutral)
            let sendMessagePerm = null;

            lockedDownPerms[guildID] = lockedDownPerms[guildID] || {};

            // brain go WAHHHHHHHH, I think this the first time I've used the bitwise AND operator
            // we need to know if it's denied, allowed, OR NEUTRAL!!!!
            // That's why we have to use this weird PermissionOverwrites workaround instead of Permissions.has()
            // 2048 is SEND_MESSAGES
            if (perms.allow & 2048) sendMessagePerm = true;
            else if (perms.deny & 2048) sendMessagePerm = false;
            lockedDownPerms[guildID][channel.id] = sendMessagePerm;

            channel.updateOverwrite(message.guild.roles.everyone, {
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