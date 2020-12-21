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

    let logs = client.channels.get('790446444112773130');
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
    if (!reason) reason = 'Disruptive behavior';
    if (user.roles.has(muteRole.id)) return message.channel.send('This person is already muted!');

    const muteEmbed = new RichEmbed()
        .setTitle('User Muted')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Silence, mortal!')
        .setTimestamp();
    // mute event
    user.addRole(muteRole).then(() => {
        logs.send(muteEmbed)
    }).then(() => {
        user.send(`You've been muted by ${message.author.tag}, in ${message.guild.name} for ${reason}.`);
    }).then(() => {
        message.channel.send(`Success! ${user.tag} has been muted.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
}

exports.help = {
    name: 'mute',
    aliases: ['m'],
    description: 'Silence someone with the power of the mute command.',
    usage: 'mute <user> <reason>'
}