const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { parseUser } = require('../utils/parse');
const { noBotPerms, noPerms } = require('../utils/errors');
const { jsonReadFile, jsonWriteFile } = require('../utils/file');
const { embedColor } = require('../config.json');

exports.run = async (client, message, args) => {
    // permissions
    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_ROLES')) return noBotPerms(message, 'MANAGE_ROLES');
    if (!message.member.permissions.has('MUTE_MEMBERS')) return noPerms(message, 'MUTE_MEMBERS');
    // command requirements
    let date = undefined;
    let reason = undefined;
    try {
        // assume the format is ?mute <userid> <date> <reason>
        reason = args.slice(2).join(' ');
        date = ms(args[1]);
        if (date === undefined) throw new Error("Not a date! Sad.");
    } catch {
        // not a valid date, or not provided
        // we know the format must be ?mute <userid> <reason>
        reason = args.slice(1).join(' ');
    }
    let member = message.guild.member(parseUser(client, args[0]));
    let logs = client.channels.cache.get('790446444112773130');
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
    if (!reason) reason = 'Disruptive behavior';
    if (member.roles.cache.has(muteRole.id)) return message.channel.send('This user is already muted!');
    if (member.roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
        return message.channel.send('You can\'t use this command on someone more or just as powerful as you!');
    }
    // action
    const muteEmbed = new MessageEmbed()
        .setTitle('User Muted')
        .addField('User', member.user.tag, false)
        .addField('Moderator', message.author.tag, false)
        .addField('Reason', reason, false)
        .addField('Server', message.guild.name + `(${message.guild.id})`, false)
        .setColor(embedColor)
        .setTimestamp();

    // I am the ternary wizard
    const dateMessage = date ? " for " + (ms(date, {long: true})) : "";
    member.send(`You've been muted by ${message.author.tag}, in ${message.guild.name} for ${reason}${dateMessage}.`).catch(() => {
        message.channel.send('I wasn\'t able to DM this user.');
    });
    member.roles.add(muteRole).then(async () => {
        logs.send(muteEmbed);
        // timed mute
        let muted = await jsonReadFile("muted.json");
        muted[member.guild.id] = muted[member.guild.id] || {};
        muted[member.guild.id][member.id] = date ? (Date.now() + date) : -1;
        await jsonWriteFile("muted.json", muted);
        // timed mute
    }).then(() => {
        message.channel.send(`<a:SuccessCheck:790804428495257600> ${member.user.tag} has been muted${dateMessage}.`);
    }).catch(e => {
        console.trace(e);
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'mute',
    aliases: ['m'],
    description: 'Silence someone with the power of the mute command.',
    usage: 'mute <member> <reason>'
};