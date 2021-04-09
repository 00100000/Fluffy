const { noPerms } = require("../utils/perms");
const { jsonReadFile, jsonWriteFile, successEmoji } = require("../utils/file");

exports.run = async (client, message, args) => {
    if (noPerms(message)) return;

    const blacklist = await jsonReadFile("./blacklist.json");
    // user issues
    if (!blacklist.blacklist.includes(args[0])) return message.channel.send("This user isn't blacklisted!");
    // action
    try {
        blacklist.blacklist.splice(blacklist.blacklist.indexOf(args[0]), 1);
        message.channel.send(`${successEmoji} ${args[0]} has been removed from the blacklist.`);
        jsonWriteFile("./blacklist.json", blacklist);
    } catch (e) {
        message.channel.send(`\`\`\`${e}\`\`\``);
    }
};

exports.help = {
    name: "unblacklist",
    aliases: [],
    description: "Unblacklists someone from using this bot.",
    usage: "unblacklist <id>"
};