const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../config');
const { noBotPerms, noPerms } = require('../utils/errors');
const { jsonReadFile, jsonWriteFile } = require('../utils/file');
const { parseUser } = require('../utils/parse');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_ROLES')) return noBotPerms(message, 'MANAGE_ROLES');
    if (!message.member.permissions.has('MUTE_MEMBERS')) return noPerms(message, 'MUTE_MEMBERS');
    // command requirements
    let reason = args.slice(1).join(' ');
    let member = message.guild.member(parseUser(client, args[0]));
    let logs = client.channels.cache.get('790485209052610560');
    let muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    // user issues
    if (!muteRole) {
        muteRole = await message.guild.createRole({
            name: 'Muted',
            color: '#000000',
            permissions: []
        });
        message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });
    }

    if (!member) return message.channel.send('This is not a member id or mention!');
    if (!reason) reason = 'Served punishment';
    if (!member.roles.cache.has(muteRole.id)) return message.channel.send('This user isn\'t muted!');
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
    }
    // action
    const unmuteEmbed = new MessageEmbed()
        .setTitle('User Unmuted')
        .addField('User', args[0], false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    member.send(`You've been unmuted by ${message.author.tag}, in ${message.guild.name} for ${reason}.`).catch(() => {
        message.channel.send('I wasn\'t able to DM this user.');
    });
    member.roles.remove(muteRole).then(async () => {
        logs.send(unmuteEmbed);

        let muted = await jsonReadFile("muted.json");
        delete muted[message.guild.id][member.id];
        jsonWriteFile("muted.json", muted);
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${member.user.tag} has been unmuted.`);
    }).catch(() => {
        message.channel.send('There was an error while processing your request!');
    });
};

exports.help = {
    name: 'unmute',
    aliases: ['um'],
    description: 'Unsilence someone.',
    usage: 'unmute <member> <reason>'
};