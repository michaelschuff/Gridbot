const { Events } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../database/loader.js");

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        var guildData = getGuildData(message.guildId);
        
        if (guildData.messageLogId != -1) {
            const channel = await message.guild.channels.fetch(guildData.messageLogId);
            channel.send(message.member.displayName + " deleted \"" + message.content + "\" in " + message.channel.name);
        }

        if (!(guildData.ticketFactories.get(message.id) === undefined)) {
            guildData.ticketFactories.delete(message.id)
        }


        setGuildData(message.guild.id, guildData);
        SaveData();

	},
};