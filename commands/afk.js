const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    let member = message.guild.member(message.author);
    let catRole = message.guild.roles.cache.find(r => r.name === 'Cat Disciple');

    if (!catRole) return message.channel.send('There is no Cat Disciple role in this server! Uncultured strays...');
    if (args[0] != 'join' && args[0] != 'leave') return message.channel.send('Please specify if you\'d like to join or leave the glorious Cat Cult!');

    if (args[0] == 'join') {
        if (member.roles.cache.has(catRole.id)) return message.channel.send('You are already a member of the Cat Cult!');
        member.roles.add(catRole).then(() => {
            message.channel.send(`<a:SuccessCheck:790804428495257600> You have joined the Cat Cult! Traditionally, members add [CAT] to the front of their names and have a cat pfp. Not required, but suggested!`);
        }).catch(e => {
            message.channel.send(`\`\`\`${e}\`\`\``);
        });
    } else {
        if (!member.roles.cache.has(catRole.id)) return message.channel.send('You are not a member of the Cat Cult!');
        member.roles.remove(catRole).then(() => {
            message.channel.send(`<a:SuccessCheck:790804428495257600> You have left the Cat Cult :(`);
        }).catch(e => {
            message.channel.send(`\`\`\`${e}\`\`\``);
        });
    }
};

exports.help = {
    name: 'afk',
    aliases: [],
    description: 'Sends a message notifying others why you\'re afk.',
    usage: 'afk <reason>'
};