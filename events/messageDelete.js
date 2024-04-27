const { Events } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../database/loader.js");

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        var guildData = getGuildData(channel.guild.id);
        if (!(guildData.ticketGenerators.get(message.id) === undefined)) {
            guildData.ticketGenerators.delete(message.id)
        }
        setGuildData(message.guild.id, guildData);
        SaveData();
	},
};