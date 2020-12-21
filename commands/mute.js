const { RichEmbed } = require('discord.js');
const { embedColor, owner } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_ROLES')) return noBotPerms(message, 'MANAGE_ROLES');
    if (!message.member.permissions.has('MANAGE_ROLES') && message.author.id !== owner) return noPerms(message, 'MANAGE_ROLES');

    let reason = args.slice(1).join(' ');
    let user = message.mentions.members.first();

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

    if (!user) return message.channel.send('You didn\'t provide me with a user to mute!');
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
        user.send(`You've been muted by ${message.author.tag}(${message.author.id}), in ${message.guild.name}(${message.guild.id}) for ${reason}.`);
    });
}

exports.help = {
    name: 'mute',
    aliases: [],
    description: 'Silence someone with the power of the mute command.',
    usage: 'mute <user> <reason>'
}