const { RichEmbed } = require('discord.js');
const { embedColor, owner } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_NICKNAMES')) return noBotPerms(message, 'MANAGE_NICKNAMES');

    let logs = client.channels.get('790650641429168167');
    let user = parseUser(client, args[0]);

    if (!user) {
        if (!message.guild.member(message.author).bannable) return message.channel.send('You are too powerful to have your nickname changed by me!');
        let newNick = args.join(' ');
        let oldNick = message.guild.member.displayName ? message.guild.member.displayName : message.author.username;

        if (!newNick) return message.channel.send('You didn\'t tell me what you want your new nickname to be!');
        if (newNick.length >= 32) return message.channel.send('Your nickname must be less than 32 characters long!');

        const selfNickEmbed = new RichEmbed()
            .setTitle('User Changed Their Own Nickame')
            .addField('User', message.author.id, false)
            .addField('Old Nickname', oldNick, false)
            .addField('New Nickname', newNick, false)
            .addField('Server', message.guild.name + `(${message.guild.id})`, false)
            .setColor(embedColor)
            .setFooter('I can\'t think of a clever footer message for this')
            .setTimestamp();
        // do stuff
        message.member.setNickname(newNick).then(() => {
            message.channel.send('Done! Your new nickname is: ' + newNick);
        }).then(() => {
            modlogs.send(selfNickEmbed);
        })
    } else {
        if (!message.member.permissions.has('MANAGE_NICKNAMES') && message.author.id !== owner) return noPerms(message, 'MANAGE_NICKNAMES');
        if (!message.guild.member(user).bannable) return message.channel.send('This person is too powerful to have their nickname changed!');
        if (message.guild.member(user).highestRole.comparePositionTo(message.guild.member(message.author).highestRole) >= 0) {
            return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
        }
        let newNick = args.slice(1).join(' ');
        let oldNick = message.guild.member(user).displayName ? message.guild.member(user).displayName : user.username;

        if (!newNick) return message.channel.send('You didn\'t tell me what you want their new nickname to be!');
        if (newNick.length > 32) return message.channel.send('Their nickname must be less than 32 characters long!');

        const modNickEmbed = new RichEmbed()
            .setTitle('Moderator Changed A User\'s Nickame')
            .addField('Moderator', message.author.tag, false)
            .addField('Old Nickname', oldNick, false)
            .addField('New Nickname', newNick, false)
            .addField('Server', message.guild.name + `(${message.guild.id})`, false)
            .setColor(embedColor)
            .setFooter('I can\'t think of a clever footer message for this')
            .setTimestamp();
        // change nick
        message.guild.member(user).setNickname(newNick).then(() => {
            message.channel.send('Done! Their new nickname is: ' + newNick);
        }).then(() => {
            logs.send(modNickEmbed);
        });
    }
}

exports.help = {
    name: 'setnick',
    aliases: ['nick', 'sn'],
    description: 'Sets your nickname or lets a moderator change another user\'s nickname.',
    usage: 'setnick <new nickname> OR setnick <user> <new nickname>'
};