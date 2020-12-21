const { RichEmbed } = require('discord.js');
const { embedColor, owner } = require('../config');
const { getIdFromMention } = require('../utils/mention')
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('BAN_MEMBERS')) return noBotPerms(message, 'BAN_MEMBERS');
    if (!message.member.permissions.has('BAN_MEMBERS') && message.author.id !== owner) return noPerms(message, 'BAN_MEMBERS');
    
    let modlogs = client.channels.get('783520325547196416');
    
    let reason = args.slice(1).join(' ');
    let user = getIdFromMention(args[0]);
    let dmUser = message.mentions.members.first();

    if (!user) return message.channel.send('You didn\'t provide me with a user to unban!');
    if (!reason) reason = 'Appeal accepted';

    if(!reason) reason = 'Served punishment.';

    const unbanEmbed = new RichEmbed()
        .setTitle('User Unbanned')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('The hammer shows mercy!')
        .setTimestamp();
    // unban
    message.guild.unban(user).then(() => {
        modlogs.send(unbanEmbed);
    }).then(() => {
        dmUser.send(`You've been unbanned by ${message.author.tag}(${message.author.id}), in ${message.guild.name}(${message.guild.id}) for ${reason}.`);
    });
}

exports.help = {
    name: 'unban',
    aliases: [],
    description: 'Unbans a user for a reason and DMs them.',
    usage: 'unban <user> <reason>'
};