const { Events } = require('discord.js');

module.exports = {
	name: Events.ChannelDelete,
	async execute(channel) {
        if (global.utcVCs.get(channel.guild.id).includes(channel)) {
            global.utcVCs.get(channel.guild.id)
            var channels = global.utcVCs.get(channel.guild.id)

            const index = channels.indexOf(channel);

            channels.splice(index, index);

            global.utcVCs.set(channel.guild.id, channels)
        } else if (global.VCGenerators.get(channel.guild.id).includes(channel)) {
            global.VCGenerators.get(channel.guild.id)
            var channels = global.VCGenerators.get(channel.guild.id)

            const index = channels.indexOf(channel);

            channels.splice(index, index);

            global.VCGenerators.set(channel.guild.id, channels)
        } else if (global.tempVCs.get(channel.guild.id).includes(channel)) {
            global.tempVCs.get(channel.guild.id)
            var channels = global.tempVCs.get(channel.guild.id)

            const index = channels.indexOf(channel);

            channels.splice(index, index);

            global.tempVCs.set(channel.guild.id, channels)
        }

		
	},
};