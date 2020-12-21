function getUserFromMention(client, mention) {
    mention = mention.slice(2, -1);
    if (mention.startsWith('!')) mention = mention.slice(1);

    return client.users.cache.get(mention);
}

function getIdFromMention(mention) {
    mention = mention.slice(2, -1);
    if (mention.startsWith('!')) mention = mention.slice(1);

    return mention;
}

module.exports = {
    getUserFromMention,
    getIdFromMention
}