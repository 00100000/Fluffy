function filter(message) {
    if (message.guild.member(message.author).hasPermission('MANAGE_SERVER')) {
        return true;
    }
    const filtered = ['fuck', 'shit', 'asshole', 'dick', 'fagg', 'nigg', 'porn', 'vagina', 'dsc.gg', 'discord.gg', 'https:'];
    if (filtered.some((s) => message.content.toLowerCase().includes(s))) {
        return false;
    }
    return true;
}

module.exports = {
    filter
}