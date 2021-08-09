require("moment-duration-format");
const moment = require("moment");
const { MessageEmbed, version: discordVersion } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { embedColor } = require("../config.json");

exports.run = async (client, message, args) => {
    if (noPerms(message, "EMBED_LINKS", "SEND_MESSAGES")) return;

    const botUptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const guildSize = client.guilds.cache.size.toLocaleString();
    const userSize = client.users.cache.size.toLocaleString();

    const statsEmbed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setColor(embedColor)
        .addField("Guilds", guildSize, true)
        .addField("Users", userSize, true)
        .addField("Uptime", botUptime, true)
        .addField("Memory", `${Math.round(memUsage)} MB`, true)
        .addField("Discord.js", `v${discordVersion}`, true)
        .addField("Commit", client.commit, true)
        .setFooter(`Made with <3 and discord.js by 00100000#0032`);

    message.channel.send(statsEmbed).catch(e => {
        message.channel.send(`\`\`\`${e}\`\`\``);
    });
}

exports.help = {
    name: "stats",
    aliases: ["s"],
    description: "View bot statistics.",
    usage: "stats"
}