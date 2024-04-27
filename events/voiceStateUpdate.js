const { Events, PermissionFlagsBits, ChannelType, PermissionsBitField } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../database/loader.js");

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
        if (newState.channelId != oldState.channelId) {
            if (oldState.channelId != null) {
                var guildData = getGuildData(oldState.guild.id);
                
                const index = guildData.tempVCs.indexOf(oldState.channelId);
                if (index != -1) {
                    if (oldState.channel.members === undefined) {
                        const ch = oldState.guild.channels.cache.get(oldState.channelId);

                        guildData.tempVCs.splice(guildData.tempVCs.indexOf(oldState.channelId),1);
                        setGuildData(oldState.guild.id, guildData);

                        ch.delete();
                        SaveData();
                    } else if (oldState.channel.members.size == 0) {
                        oldState.channel.delete()

                        guildData.tempVCs.splice(guildData.tempVCs.indexOf(oldState.channelId),1);
                        setGuildData(oldState.guild.id, guildData);
                        SaveData();
                    }
                }
            } 
            if (newState.channelId != null) {
                var guildData = getGuildData(newState.guild.id);

                const index = guildData.VCFactories.indexOf(newState.channelId);
                if (index != -1) {
                    const channel = await newState.guild.channels.create({
                        name: newState.member.user.username + "'s channel", // The name of the channel
                        type: ChannelType.GuildVoice,
                        parent: newState.channel.parent
                    })
                    newState.member.voice.setChannel(channel)

                    guildData.tempVCs.push(channel.id)
                    setGuildData(newState.guild.id, guildData)                
                    SaveData();
                }
            }
        }
	},
};
