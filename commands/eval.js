const { noPerms } = require("../utils/perms");

exports.run = async (client, message, args) => {
    if (noPerms(message)) return;

    let output = undefined;
    try {
        output = eval(args.join(" ")) + "";
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }

    if (output.length === 0) return message.channel.send("No output");
    if (output.length > 2000) return message.channel.send("Output is too long to send (> 2000 chars)");

    message.channel.send(output);
}

exports.help = {
    name: "eval",
    aliases: ["e"],
    description: "Run raw Javascript code via the bot.",
    usage: "eval <code>"
}