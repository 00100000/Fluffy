const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { jsonReadFile } = require('../utils/file');

module.exports = async (client, member) => {
    let logs = client.channels.cache.get('790446588392243200');

    let muted = await jsonReadFile("muted.json");
    if (Object.keys(muted).includes(member.guild.id)) {
        if (Object.keys(muted[member.guild.id]).includes(member.id)) {
            let muteRole = member.guild.roles.cache.find(r => r.name === 'Muted');
            member.roles.add(muteRole);
        }
    }

    const addEmbed = new MessageEmbed()
        .setTitle('Add Event')
        .addField('User', `${member.displayName}(${member.id})`, false)
        .addField('Server', member.guild.name + `(${member.guild.id})`, false)
        .setColor(embedColor)
        .setFooter('Welcome!')
        .setTimestamp();

    logs.send(addEmbed);
};