const existsSync = require("fs").existsSync;
const { prefix } = require("../config.json");

module.exports = async (client, message) => {
    // DMs and bots
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
    // command and args parsing
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // aliases
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // check if valid command or blacklisted author
    if (!cmd) return;
    if (existsSync("../blacklist.json")) {
        if (require("../blacklist.json").includes(message.author.id)) return;
    }
    // execute command
    if (!message.guild.me.permissions.has("ADMINISTRATOR")) return message.channel.send(
        "This bot cannot function properly without Administrator. In the future, we plan to make it still functional with less perms, sorry for the inconvenience."
    );
    console.log(`${message.author.tag} (${message.author.id}) used ${command} in ${message.guild.name} (${message.guild.id})`);
    cmd.run(client, message, args);
};