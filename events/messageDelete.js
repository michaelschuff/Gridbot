const { Events } = require('discord.js');
const { SaveGlobals} = require("./../Global.js");

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        if (!(global.ticketGenerators.get(message.id) === undefined)) {
            global.ticketGenerators.delete(message.id)
        }
        SaveGlobals();
	},
};