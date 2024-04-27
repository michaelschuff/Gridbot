const { Events } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../database/loader.js");

module.exports = {
	name: Events.ChannelDelete,
	async execute(channel) {
        var guildData = getGuildData(channel.guild.id);


        var index = guildData.utcVCs.indexOf(channel.id);
        if (index != -1) {
            guildData.utcVCs.splice(index, 1);
        }

        index = guildData.VCFactories.indexOf(channel.id);
        if (index != -1) {
            guildData.VCFactories.splice(index, 1);
        }

        index = guildData.tempVCs.indexOf(channel.id);
        if (index != -1) {
            guildData.tempVCs.splice(index, 1);
        }

        setGuildData(channel.guild.id, guildData);

        SaveData();
	},
};