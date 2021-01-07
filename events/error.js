module.exports = (client, error) => {
    client.logger.log(`An error event was sent by Discord.js:`, 'error');
    console.error(error);
};