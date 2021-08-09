function parseUser(client, s) {
    if (!s) return;
    if (s.startsWith("<@") && s.endsWith(">")) {
        s = s.slice(2, -1);

        if (s.startsWith("!")) {
            s = s.slice(1);
        }
    }
    return client.users.cache.get(s);
}

function parseID(s) {
    if (!s) return;
    if (s.startsWith("<@") && s.endsWith(">")) {
        s = s.slice(2, -1);

        if (s.startsWith("!")) {
            s = s.slice(1);
        }
    }
    return s;
}

function parseRole(member, s) {
    if (!s) return;

    const roleByName = member.guild.roles.cache.find(r => r.name === s);
    const roleByID = member.guild.roles.cache.get(s);

    if (roleByName) return roleByName;
    if (roleByID) return roleByID;

    if (s.startsWith("@")) return member.guild.roles.cache.find(r => r.name === s.slice(1));
    if (s.startsWith("<@&") && s.endsWith(">")) {
        s = s.slice(3, -1);
        return member.guild.roles.cache.get(s);
    }
    return;
}

function parseChannel(message, s) {
    if (!s) return;

    const channelByID = message.guild.channels.cache.get(s);
    if (channelByID) return channelByID;

    if (s.startsWith("<#") && s.endsWith(">")) {
        s = s.slice(2, -1);
        return message.guild.channels.cache.get(s);
    }
    return;
}

module.exports = {
    parseUser,
    parseID,
    parseRole,
    parseChannel
}
