exports.run = async (client, message, args) => {
    message.channel.send("https://cdn.discordapp.com/attachments/826269508834295809/826277463113203742/pet.gif");
}

exports.help = {
    name: "pet",
    aliases: [],
    description: "Pet our cute and loyal moderation bot!",
    usage: "pet"
};