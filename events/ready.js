const { prefix } = require('../config');

module.exports = async client => {

    await client.logger.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.cache.size} server(s).`);
    
    client.user.setStatus('online');
    client.user.setActivity(`${prefix}help`, { type: 'PLAYING' })
        .catch(err => client.logger.error(err));
};