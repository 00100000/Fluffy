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

    client.loadCommand = (cmdFileName) => {
        try {
            // client.logger.log(`Loading Command: ${cmdFileName} 👌`);
            const props = require(`../commands/${cmdFileName}`);
            if (props.init) props.init(client);
            client.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
            return;
        } catch (err) {
            return `Unable to load command ${cmdFileName}: ${err}`;
        }
    };

    client.loadEvent = (eventFileName) => {
        try {
            // client.logger.log(`Loading Event: ${eventFileName} 👌`);
            const event = require(`../events/${eventFileName}`);
            const evtName = eventFileName.split('.')[0];
            client.on(evtName, event.bind(null, client));
            return;
        } catch (err) {
            return `Unable to load event ${eventFileName}: ${err}`;
        }
    };

    client.unloadCommand = async (cmdFileName) => {
        let cmd;
        if (client.commands.get(cmdFileName)) cmd = client.commands.get(cmdFileName);
        else if (client.aliases.has(cmdFileName)) cmd = client.commands.get(client.aliases.get(cmdFileName));
        
        if (!cmd) return `The command \`${cmdFileName}\` doesn't seem to exist.`;

        if (cmd.shutdown) await cmd.shutdown;
        const mod = require.cache[require.resolve(`../commands/${cmdFileName}`)];
        delete require.cache[require.resolve(`../commands/${cmdFileName}.js`)];
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