const { owners, errorEmoji } = require("../config.json");

function noPerms(message, botPerm, userPerm) {
    // owner-only commands
    if (!botPerm) {
        if (owners.includes(message.author.id)) {
            return false;
        } else {
            return message.channel.send(errorEmoji + " Only the owners of the bot can use this command!");
        }
    }

    let botOrUser = 0;
    // checks if bot or user is missing permissions
    if (!message.guild.me.permissions.has(botPerm)) {
        botOrUser = 1;
    } else if (!message.member.permissions.has(userPerm)) {
        botOrUser = 2;
    }
    // return false, if not
    if (botOrUser === 0) {
        return false;
    } else {
        return message.channel.send(
            errorEmoji
            + (botOrUser === 1 ? " I" : " You")
            + " don't have permissions to do this! Required permission: "
            + (botOrUser === 1 ? botPerm : userPerm)
        );
    }
}

module.exports = {
    noPerms
}