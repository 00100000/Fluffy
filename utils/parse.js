function parseUser(client, s) {
    if (!s) return;
    if (s.startsWith('<@') && s.endsWith('>')) {
        s = s.slice(2, -1);

        if (s.startsWith('!')) {
            s = s.slice(1);
        }
    }
    return client.users.get(s);
}

function parseRole(member, s) {
    if (!s) return;
    if (member.guild.roles.find(r => r.name == s)) return member.guild.roles.find(r => r.name == s);
    if (member.guild.roles.has(s)) return member.guild.roles.get(s);
    if (s.startsWith('@')) return member.guild.roles.find(r => r.name == s.slice(1));
    if (s.startsWith('<@&') && s.endsWith('>')) {
        s = s.slice(3, -1);
        return member.guild.roles.get(s);
    }
    return;
}

module.exports = {
    parseUser,
    parseRole
}