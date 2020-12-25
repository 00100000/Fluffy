const { noBotPerms, noPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('ADMINISTRATOR')) return noBotPerms(message, 'ADMINISTRATOR');
    if (!message.member.permissions.has('ADMINISTRATOR')) return noPerms(message, 'ADMINISTRATOR');
    // user issues
    if (message.guild.member(args[0])) return message.channel.send('This user is in this server! Use ?ban instead!');
    // action
    message.guild.members.ban(args[0], {days: 7, reason: 'rawban'}).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600>`);
    }).catch(err => {
        message.channel.send(`\`\`\`xl\n${err}\`\`\``);
    });
}

exports.help = {
    name: 'rawban',
    aliases: ['rb'],
    description: 'An unlogged Guild.ban() ban command without member restrictions. Available only to trusted Admins and useful for banning people who haven\'t joined the server yet.',
    usage: 'rawban <user>'
};