function filter(message) {
    if (message.guild.member(message.author).hasPermission('MANAGE_SERVER')) {
        return false;
    }
    const filtered = ['fuck', 'shit', 'asshole', 'dick', 'fagg', 'nigg', 'porn', 'vagina', 'dsc.gg', 'discord.gg', 'https:'];
    if (filtered.some((s) => message.content.toLowerCase().includes(s))) {
        return true
    }
    return false;
}

module.exports = {
    filter
}