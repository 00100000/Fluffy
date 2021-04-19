module.exports = (client) => {
    client.loadCommand = (cmdFileName) => {
        try {
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
            const event = require(`../events/${eventFileName}`);
            const evtName = eventFileName.split(".")[0];
            client.on(evtName, event.bind(null, client));
            return;
        } catch (err) {
            return `Unable to load event ${eventFileName}: ${err}`;
        }
    };

    process.on("SIGTERM", async () => {
        await console.log("SIGTERM signal received.");
        await client.destroy(() => {
            console.log("Client destroyed.");
            process.exit(0);
        });
    });
    
    process.on("unhandledRejection", e => {
	    console.error(e);
    });
};
