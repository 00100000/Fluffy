const { promisify } = require("util");
const { Client } = require("discord.js");
const readdir = promisify(require("fs").readdir);
require("dotenv-flow").config({ silent: true });

require("dotenv").config();

const client = new Client({
	disableMentions:  "everyone",
	fetchAllMembers: true,
	messageCacheMaxSize: 500,
	messageCacheLifetime: 86400,
	messageSweepInterval: 86400
});

client.commit = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();

client.commands = new Map();
client.aliases = new Map();

require("./utils/functions")(client);

const init = async () => {
	const cmdFiles = await readdir("./commands/");
	cmdFiles.forEach(f => {
		if (!f.endsWith(".js")) return;
		const response = client.loadCommand(f);
		if (response) console.error(response);
	});

	const evtFiles = await readdir("./events/");
	evtFiles.forEach(f => {
		if (!f.endsWith(".js")) return;
		const response = client.loadEvent(f);
		if (response) console.error(response);
	});

	client.login(process.env.CLIENT_TOKEN);
};

init();