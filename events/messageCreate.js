const { Events } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../database/loader.js");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        var guildData = getGuildData(message.guildId);
        if (guildData.messageLogId != -1) {
            if (message.channelId != guildData.messageLogId) { // dont log the logged messages
                const channel = await message.guild.channels.fetch(guildData.messageLogId);
                channel.send(message.author.username + " sent \"" + message.content + "\" in " + message.channel.name);
            }
        }
	},
};