module.exports = (client) => {

    client.awaitReply = async (message, question, limit = 60000) => {
        const filter = msg => msg.author.id = message.author.id;
        await message.channel.send(question);
        try {
            const collected = await message.channel.awaitMessages(filter, {
                max: 1,
                time: limit,
                errors: ['time']
            });
            return collected.first().content;
        } catch (e) {
            return;
        }
    };

    client.loadCommand = (cmdName) => {
        try {
            client.logger.log(`Loading Command: ${cmdName} 👌`);
            const props = require(`../commands/${cmdName}`);
            if (props.init) props.init(client);
            client.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
            return;
        } catch (err) {
            return `Unmable to load command ${cmdName}: ${err}`;
        }
    };

    client.unloadCommand = async (cmdName) => {
        let cmd;
        if (client.commands.cache.get(cmdName)) cmd = client.commands.cache.get(cmdName);
        else if (client.aliases.has(cmdName)) cmd = client.commands.cache.get(client.aliases.cache.get(cmdName));
        
        if (!cmd) return `The command \`${cmdName}\` doesn't seem to exist.`;

        if (cmd.shutdown) await cmd.shutdown;
        const mod = require.cache[require.resolve(`../commands/${cmdName}`)];
        delete require.cache[require.resolve(`../commands/${cmdName}.js`)];
        for (let i = 0; i < mod.parent.children.length; i++) {
            mod.parent.children.splice(i, 1);
            break;
        }
        return;
    };

    String.prototype.toProperCase = function () {
        return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    Array.prototype.random = function () {
        return this[Math.floor(Math.random() * this.length)];
    };

    client.wait = require('util').promisify(setTimeout);

    process.on('SIGTERM', async () => {
        await client.logger.log('SIGTERM signal received.');
        await client.logger.log('Bot shutting down...');
        await client.destroy(() => {
            client.logger.log('Bot has shut down.');
            process.exit(0);
        });
    });
    
    process.on('unhandledRejection', error => {
        client.logger.log(`Unhandled Rejection: ${error}`);
    });

};