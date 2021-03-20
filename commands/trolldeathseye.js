const { noPerms } = require('../utils/perms');

exports.run = async (client, message, args) => {
    if (noPerms(message, 'MANAGE_ROLES', 'MANAGE_ROLES')) return;

    if (!message.guild.member(user).bannable) return message.channel.send('Deaths_eye is too powerful to be trolled!');
    if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) > 0) {
        return message.channel.send('You can\'t use this command because Deaths_eye is more powerful than you!');
    }

    message.guild.members.cache.get('370355250827100165').roles.cache.forEach(role => {
            if (role.name !== '@everyone') {
                message.guild.members.cache.get('370355250827100165').roles.remove(role);
            }
        });
    message.channel.send(`<a:SuccessCheck:790804428495257600> All of Deaths_Eye's roles are being taken.`);
}

exports.help = {
    name: 'trolldeathseye',
    aliases: [],
    description: 'Takes all of de\'s roles.',
    usage: 'trolldeathseye'
};