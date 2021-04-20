async function setupLogs(message, logsName) {
    let logs = message.guild.channels.cache.find(c => c.name === logsName);
    if (!logs) {
        try {
            logs = await message.guild.channels.create(logsName);
            message.channel.send(`Please set up the permissions for #${logsName} according to your needs manually.`);
        } catch(e) {
            console.error(e);
        }
    }
    return logs;
}

module.exports = {
    setupLogs
};