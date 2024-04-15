const { Events, PermissionFlagsBits, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
        if (newState.channelId == null) {
            // disconnected
        } else if (oldState.channelId == null) {
            // joined
        } 
        
        if (newState.channelId != oldState.channelId) {
            // swapped
            if (global.tempVCs.get(oldState.guild.id) === undefined) {
                global.tempVCs.set(oldState.guild.id, [])
            }
            var tempGuildVCs = global.tempVCs.get(oldState.guild.id)
            for (channel of tempGuildVCs) {
                if (oldState.channelId == channel.id) {
                    if (channel.members.size == 0) {
                        channel.delete()
                        const index = tempGuildVCs.indexOf(channel)
                        tempGuildVCs.splice(index,1)
                        global.tempVCs.set(oldState.guild.id, tempGuildVCs)
                    }
                    break;
                }
            }
        }
        
        if (global.VCGenerators.get(newState.guild.id) === undefined) {
            global.VCGenerators.set(newState.guild.id, [])
        }
        var guildVCgenerators = global.VCGenerators.get(newState.guild.id)
        for (channel of guildVCgenerators) {
            if (newState.channelId == channel.id) {
                var tempChannel = await newState.guild.channels.create({
                    name: newState.member.user.username + "'s channel", // The name of the channel
                    type: ChannelType.GuildVoice,
                    parent: newState.channel.parent
                })

                if (global.tempVCs.get(newState.guild.id) === undefined) {
                    global.tempVCs.set(newState.guild.id, [])
                }
                var newChannels = global.tempVCs.get(newState.guild.id)
                newChannels.push(tempChannel)
                global.tempVCs.set(newState.guild.id, newChannels)

                newState.member.voice.setChannel(tempChannel)
                break;
            }
        }
            
            
	},
};
