const ms = require("ms");
const { noPerms } = require("../utils/perms");

exports.run = async (client, message, args) => {
	if (noPerms(message, "MANAGE_CHANNELS", "MANAGE_CHANNELS")) return;

	let time = undefined;
	try {
		time = ms(args[0]);
	} catch (e) {
		return message.channel.send("This is not a valid time!");
	}
	if (time < 5000 || time > 21600000) return message.channel.send("You must enter a time between 5 seconds and 6 hours!");

	message.channel.setRateLimitPerUser(time / 1000, `Slowmode set by ${message.author.tag}`).then(() => {
		message.channel.send(`Set slowmode to ${ms(time, { long: true })}.`);
	});
}

exports.help = {
	name: "slowmode",
	aliases: ["sm"],
	description: "Sets a slowmode for a channel. Defaults to 5 seconds",
	usage: "slowmode <time>"
}