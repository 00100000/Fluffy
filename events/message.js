const existsSync = require("fs").existsSync;
const { prefix } = require("../config.json");

module.exports = async (client, message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (!cmd) return;
    if (existsSync("../blacklist.json")) {
        if (require("../blacklist.json").includes(message.author.id)) return;
    }

    if (!message.guild.me.permissions.has("ADMINISTRATOR")) return message.channel.send(
        "This bot cannot function properly without Administrator. In the future, we plan to make it still functional with less perms, sorry for the inconvenience."
    );
    cmd.run(client, message, args);
};