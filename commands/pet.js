const { noPerms } = require('../utils/perms');

exports.run = async (client, message, args) => {
    if (noPerms(message, 'SEND_MESSAGES', 'SEND_MESSAGES')) return;

    message.channel.send('https://cdn.discordapp.com/attachments/826269508834295809/826277463113203742/pet.gif');
}

exports.help = {
    name: "pet",
    aliases: [],
    description: "Pet our cute and loyal moderation bot!",
    usage: "pet"
};