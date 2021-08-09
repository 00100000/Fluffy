const { noPerms } = require("../utils/perms");

exports.run = async (client, message, args) => {
    if (noPerms(message, "SEND_MESSAGES", "SEND_MESSAGES")) return;

    message.channel.send("https://cdn.discordapp.com/attachments/826269508834295809/826872572024062102/treat.gif");
}

exports.help = {
    name: "treat",
    aliases: [],
    description: "Give Fluffy a treat!",
    usage: "treat"
}