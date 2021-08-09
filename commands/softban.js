const { MessageEmbed } = require("discord.js");
const { noPerms } = require("../utils/perms");
const { parseUser } = require("../utils/parse");
const { setupLogs } = require("../utils/setup");
const { embedColor, successEmoji } = require("../config.json");

exports.run = async (client, message, args) => {
	if (noPerms(message, "BAN_MEMBERS", "BAN_MEMBERS")) return;

	let logs = await setupLogs(message, "command-logs");
	let user = parseUser(client, args[0]);
	let reason = args.slice(1).join(" ");
	// user issues
	if (!user) {
		user = args[0];
		message.guild.members.ban(user, { days: 7, reason: `${message.author.tag}: ${args.slice(1).join(" ")}` })
			.then(() => {
				message.channel.send(`${successEmoji} ${user} has been softbanned.`);
			}).catch(e => {
				message.channel.send("This is not a user id or mention!");
			});
		return;
	}
	if (message.guild.member(user)) {
		if (!message.guild.member(user).bannable) return message.channel.send("This user is too powerful to be softbanned!");
		if (message.guild.member(user).roles.highest.comparePositionTo(message.guild.member(message.author).roles.highest) >= 0) {
			return message.channel.send("You can't use this command on someone more or just as powerful as you!");
		}
	}
	if (!reason) reason = "Disruptive behavior";
	// action
	const softbanEmbed = new MessageEmbed()
		.setTitle("User Softbanned")
		.addField("User", user.tag, false)
		.addField("Moderator", message.author.tag, false)
		.addField("Reason", reason, false)
		.setColor(embedColor);

	user.send(`You've been softbanned by ${message.author.tag}, in ${message.guild.name} for ${reason}.`)
		.catch(() => {
			message.channel.send("I wasn't able to DM this user.");
		});
	logs.send(softbanEmbed).then(async () => {
		message.guild.members.ban(user, { days: 7, reason: `${message.author.tag}: ${reason}` });
	}).then(async () => {
		message.guild.members.unban(user, "softban");
	}).then(() => {
		message.channel.send(`${successEmoji} ${user.tag} has been softbanned.`);
	}).catch(e => {
		message.channel.send(`\`\`\`${e}\`\`\``);
	});
}

exports.help = {
	name: "softban",
	aliases: ["sb"],
	description: "Bans a user and erases their message history from the past week.",
	usage: "softban <user> <reason>"
}