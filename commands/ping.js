const { noPerms } = require("../utils/perms");

exports.run = async (client, message, args) => {
    if (noPerms(message, "EMBED_LINKS", "SEND_MESSAGES")) return;

    message.channel.send("Calculating ping...").then(m => {
        m.edit(`🏓 Pong!\nLatency: ${m.createdTimestamp - message.createdTimestamp}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`);
    });
};

exports.help = {
    name: "ping",
    aliases: ["p"],
    description: "Shows the bot's ping and discord api response times.",
    usage: "ping"
};