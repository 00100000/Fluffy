const { noPerms } = require("../utils/perms");

exports.run = async (client, message, args) => {
    if (noPerms(message, "SEND_MESSAGES", "SEND_MESSAGES")) return;

    message.channel.send("https://cdn.discordapp.com/attachments/826269508834295809/841316128039239720/naughty.gif");
}

exports.help = {
    name: "naughty",
    aliases: [],
    description: "Fluffy has been a bad boy!",
    usage: "naughty"
};