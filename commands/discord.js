const { noPerms } = require("../utils/perms");
const { discord } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "SEND_MESSAGES", "SEND_MESSAGES")) return;

    message.channel.send(discord);
}

exports.help = {
    name: "discord",
    aliases: [],
    description: "Get a link to Fluffy's support server!",
    usage: "discord"
};