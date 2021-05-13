const { noPerms } = require("../utils/perms");

exports.run = async (client, message, args) => {
    if (noPerms(message, "SEND_MESSAGES", "SEND_MESSAGES")) return;

    message.channel.send("https://cdn.discordapp.com/attachments/826269508834295809/841316195047440394/cuddle.gif");
}

exports.help = {
    name: "cuddle",
    aliases: [],
    description: "Cuddle with Fluffy!",
    usage: "cuddle"
};