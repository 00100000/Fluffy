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

module.exports = {
    parseUser
}