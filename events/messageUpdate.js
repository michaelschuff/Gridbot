const { Events } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../database/loader.js");
Events.MessageUpdate
module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {
        var guildData = getGuildData(oldMessage.guildId);
        if (guildData.messageLogId != -1) {
            const channel = await oldMessage.guild.channels.fetch(guildData.messageLogId);
            channel.send(oldMessage.author.username + " edited \"" + oldMessage.content + "\" to \"" + newMessage.content + "\" in " + oldMessage.channel.name);
        }

	},
};