const { owner } = require('../config');

exports.run = async (client, message, args) => {

    if (message.author.id !== owner) return message.channel.send('Only the owner of this bot can use this command!');

    try {
        // todo: possible paginate eval output, or give warning
        const output = eval(args.join(' '));
        
        if (output.length === 0) return;
        if (output.length > 2000) return message.channel.send(`Output is too big! (${output.length})`);

        message.channel.send(output);
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