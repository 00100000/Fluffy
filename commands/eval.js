const { owner } = require('../config');

exports.run = async (client, message, args) => {

    if (message.author.id !== owner) return message.channel.send('Only the owner of this bot can use this command!');

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