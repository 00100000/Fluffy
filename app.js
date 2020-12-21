const { Client } = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
require('dotenv-flow').config();

const client = new Client({
	disableEveryone:  true,
	messageCacheMaxSize: 500,
	messageCacheLifetime: 120,
	messageSweepInterval: 60
});

client.commands = new Enmap();
client.aliases = new Enmap();

client.logger = require('./utils/logger');

require('./utils/functions')(client);

const init = async () => {

	const cmdFiles = await readdir('./commands/');
	cmdFiles.forEach(f => {
		if (!f.endsWith('.js')) return;
		const response = client.loadCommand(f);
		if (response) client.logger.log(response);
	});
	client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);

	const evtFiles = await readdir('./events/');
	evtFiles.forEach(f => {
		const evtName = f.split('.')[0];
		client.logger.log(`Loading Event: ${evtName} 👌`);
		const event = require(`./events/${f}`);
		client.on(evtName, event.bind(null, client));
	});
	client.logger.log(`Loading a total of ${evtFiles.length} events.`);

	client.login(process.env.CLIENT_TOKEN);
};

init();