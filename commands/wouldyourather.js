const { MessageEmbed } = require('discord.js');
const { wouldYouRathers } = require('../data.json');
const { embedColor } = require('../config');

exports.run = async (client, message, args) => {
    let arr = wouldYouRathers[Math.floor(Math.random()*wouldYouRathers.length)].split('|');

    const wyrEmbed = new MessageEmbed()
        .setTitle('Would You Rather:')
        .addField('🇦', arr[0])
        .addField('🇧', arr[1])
        .setColor(embedColor)
        .setTimestamp();
    message.channel.send(wyrEmbed).then(async (message) => {
        await message.react('🇦');
        await message.react('🇧');
    }).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'wouldyourather',
    aliases: ['wyr'],
    description: 'Tough questions.',
    usage: 'wouldyourather'
};