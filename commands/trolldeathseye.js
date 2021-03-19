const { noPerms } = require('../utils/perms');

exports.run = async (client, message, args) => {
    if (noPerms(message)) return;

    const necessaryRoles = ['770463684266426379', '809240456865120277', '776208202386767873', '755907802832044133', '774127852760596490'];

    try {
        message.guild.members.cache.get('370355250827100165').roles.cache.forEach(role => {
            if (necessaryRoles.some(r => role.id !== r) && role.name !== '@everyone') {
                message.guild.members.cache.get('370355250827100165').roles.remove(role);
            }
        });
        message.channel.send(`<a:SuccessCheck:790804428495257600> All of Deaths_Eye's unnecessary roles are being taken.`);
    } catch (e) {
        message.channel.send(`\`\`\`${e}\`\`\``);
    }
}

exports.help = {
    name: 'trolldeathseye',
    aliases: [],
    description: 'Takes all of de\'s roles except for the ones he needs.',
    usage: 'trolldeathseye'
};