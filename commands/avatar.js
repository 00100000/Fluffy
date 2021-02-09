const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { parseUser, parseRole } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    
    // command requirements
    let member = undefined;
    if (args[0]) {
        member = parseUser(client, args[0]);
    } else {
        member = message.author;
    }

    let avatarEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setAuthor(member.username)
        .setThumbnail(member.avatarURL());
    message.channel.send(avatarEmbed);
};

exports.help = {
    name: 'avatar',
    aliases: ['av'],
    description: 'Shows a user\'s avatar',
    usage: 'av <member>'
};