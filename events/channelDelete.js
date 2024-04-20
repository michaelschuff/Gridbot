const { Events } = require('discord.js');
const { SaveGlobals} = require("./../Global.js");

module.exports = {
	name: Events.ChannelDelete,
	async execute(channel) {

        if (!(global.utcVCs.get(channel.guild.id) === undefined)) {
            if (global.utcVCs.get(channel.guild.id).includes(channel)) {
                global.utcVCs.get(channel.guild.id)
                var channels = global.utcVCs.get(channel.guild.id)
    
                const index = channels.indexOf(channel);

                channels.splice(index, 1);
                
    
                global.utcVCs.set(channel.guild.id, channels)
            } 
        }
        
        if (!(global.VCGenerators.get(channel.guild.id) === undefined)) {
            if (global.VCGenerators.get(channel.guild.id).includes(channel)) {
                global.VCGenerators.get(channel.guild.id)
                var channels = global.VCGenerators.get(channel.guild.id)
    
                const index = channels.indexOf(channel);
    
                channels.splice(index, 1);
    
                global.VCGenerators.set(channel.guild.id, channels)
            } 
        }
        
        
        if (!(global.tempVCs.get(channel.guild.id) === undefined)) {
            if (global.tempVCs.get(channel.guild.id).includes(channel)) {
                global.tempVCs.get(channel.guild.id)
                var channels = global.tempVCs.get(channel.guild.id)
    
                const index = channels.indexOf(channel);
    
                channels.splice(index, 1);
    
                global.tempVCs.set(channel.guild.id, channels)
            }
        }

        SaveGlobals();

		
	},
};