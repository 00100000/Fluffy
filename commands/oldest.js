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

    const oldest = message.guild.members.cache
                        .map(v => v)
                        .sort((a, b) => a.id - b.id)
                        .splice(0, 10);

    message.channel.send(
        "**Ten oldest users**:\n" +

        oldest.map(gu => {
            return `**${gu.user.username}#${gu.user.discriminator}** (${gu.id}) --> ${moment(gu.user.createdAt).calendar()}`;
        }).join("\n") +

        "\n...\n" +

        `**${message.author.user.username}#${message.author.discriminator}** (${gu.id}) --> ${moment(gu.user.createdAt).calendar()}`
    );

};

exports.help = {
    name: 'oldest',
    aliases: [],
    description: 'View the top 10 oldest members in the server.',
    usage: 'oldest'
};