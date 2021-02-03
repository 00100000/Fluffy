require('dotenv-flow').config({ silent: true, path: './.ENV' });

module.exports = {
    prefix: process.env.PREFIX,
    owners: process.env.OWNERS.split(":"),
    embedColor: process.env.DEFAULT_COLOR,
    discord: process.env.DISCORD,
    invite: process.env.INVITE
};