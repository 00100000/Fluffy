const { topics } = require('../data.json');

exports.run = async (client, message, args) => {
    message.channel.send(topics[Math.floor(Math.random()*topics.length)]).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
};

exports.help = {
    name: 'topic',
    aliases: ['tp'],
    description: 'Gives you something fun to talk about.',
    usage: 'topic'
};