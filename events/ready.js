const { prefix } = require('../config');

module.exports = async client => {
    await client.logger.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.cache.size} server(s).`);

    const activities = ['discord.gg/socialize', 'you sleep', `${client.users.cache.size} nerds`,
                        `for ${prefix}help`, 'Infernal the Daddy Dragon'];
    
    client.user.setStatus('online');
    setInterval(() => {
        client.user.setActivity(activities[Math.floor(Math.random() * activities.length)], { type: 'WATCHING' })
            .catch(err => client.logger.error(err));
    }, 20000);
};
