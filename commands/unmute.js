const { RichEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_ROLES')) return noBotPerms(message, 'MANAGE_ROLES');
    if (!message.member.permissions.has('MANAGE_ROLES')) return noPerms(message, 'MANAGE_ROLES');

    let reason = args.slice(1).join(' ');
    let user = parseUser(client, args[0]);

    let logs = client.channels.get('790485209052610560');
    let muteRole = message.guild.roles.find(r => r.name === 'Muted');

    if (!muteRole) {
        muteRole = await message.guild.createRole({
            name: 'Muted',
            color: '#000000',
            permissions: []
        });
        message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });
    }

    if (!user) return message.channel.send('This is not a user id or mention!');
    if (!reason) reason = 'Served punishment';
    if (!user.roles.has(muteRole.id)) return message.channel.send('This person isn\'t muted!');

    const unmuteEmbed = new RichEmbed()
        .setTitle('User Unmuted')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('You may speak, my son.')
        .setTimestamp();
    // mute event
    user.removeRole(muteRole).then(() => {
        logs.send(unmuteEmbed)
    }).then(() => {
        user.send(`You've been unmuted by ${message.author.tag}, in ${message.guild.name} for ${reason}.`);
    });
}

exports.help = {
    name: 'unmute',
    aliases: [],
    description: 'Unsilence someone.',
    usage: 'unmute <user> <reason>'
}