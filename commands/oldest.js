// ?e message.guild.members.cache.map(v => v.id).sort().splice(0, 10)

const { MessageEmbed, version: discordVersion } = require('discord.js');
const moment = require('moment');
const { embedColor } = require('../config');
const { version } = require('../package.json');
const { noBotPerms } = require('../utils/errors');
require('moment-duration-format');

exports.run = async (client, message, args) => {
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    const count = args[0] || 10;

    if (count < 1 || count > 20) return message.channel.send("Invalid number! The count must be 1-20!");

    const oldest = message.guild.members.cache
                        .map(v => v)
                        .sort((a, b) => a.id - b.id)
                        .slice(0, count);

    const authorIndex = oldest.findIndex(v => message.author.id === v.id);
    
    message.channel.send(
        "**Ten oldest users**:\n" +

        oldest.slice(0, count).map((gu, i) => {
            return `#${i+1} **${gu.user.username}#${gu.user.discriminator}** (${gu.id}) --> ${moment(gu.user.createdAt).calendar()}`;
        }).join("\n") +

        "\n...\n" +

        `#${authorIndex+1} **${message.author.username}#${message.author.discriminator}** (${message.author.id}) --> ${moment(message.author.createdAt).calendar()}`
    );
};

exports.help = {
    name: 'oldest',
    aliases: [],
    description: 'View the top 10 oldest members in the server.',
    usage: 'oldest'
};