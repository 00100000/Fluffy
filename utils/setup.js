async function setupLogs(message, logsName) {
    let logs = message.guild.channels.cache.find(c => c.name === logsName);
    if (logs) {
        return logs;
    } else {
        try{
            modlogs = await message.guild.createChannel(logsName, "text");
            message.reply(`Please set up the permissions for ${logsName} according to your needs manually. The channel will automatically be created soon.`);
        } catch(e) {}
    }
}

module.exports = {
    setupLogs
};