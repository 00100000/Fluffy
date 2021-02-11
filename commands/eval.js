const { noPerms } = require('../utils/perms');

exports.run = async (client, message, args) => {
    if (noPerms(message)) return;

    try {
        message.channel.send(eval(args.join(' ')));
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }

};

exports.help = {
    name: 'eval',
    aliases: ['e'],
    description: 'Run raw Javascript code via the bot.',
    usage: 'eval <code>'
};