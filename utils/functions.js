module.exports = (client) => {
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

    process.on('SIGTERM', async () => {
        await client.logger.log('SIGTERM signal received.');
        await client.logger.log('Bot shutting down...');
        await client.destroy(() => {
            client.logger.log('Bot has shut down.');
            process.exit(0);
        });
    });
    
    process.on('unhandledRejection', error => {
        client.logger.error(`I bet this is Natsumi's fault: ${error}\n\n\nDetails:`);
        console.error(error);
    });

};