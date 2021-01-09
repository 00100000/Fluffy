const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return noPerms(message, 'MANAGE_MESSAGES');
    // command requirements'
    let tag = args[0] || message.author.tag.slice(-4);
    // user issues
    if (isNaN(tag) || tag < 1 || tag.toString().length != 4) {
        return message.channel.send('This is not a valid tag!');
    }
    // action
    try {
        let tagArr = message.guild.members.cache.array().filter(member => {
            if (member.user.tag.slice(-4) === tag) {
                return member.user.tag;
            }
        });
        if (tagArr.length === 0) return message.channel.send('Nobody in this server has the same discriminator!');
        while (tagArr.length > 10) tagArr.pop();
        const tagEmbed = new MessageEmbed()
            .setTitle('Users With Matching Tags')
            .setDescription(tagArr.toString().replace(/,/g, '\n'))
            .setColor(embedColor)
            .setTimestamp();
        message.channel.send(tagEmbed);
    } catch (e) {
        message.channel.send(`\`\`\`${e}\`\`\``);
    }
}

exports.help = {
    name: 'tag',
    aliases: ['discrim'],
    description: 'Finds users with a matching tag to yours or a provided 4-digit tag.',
    usage: 'tag [4-digit-tag]'
};