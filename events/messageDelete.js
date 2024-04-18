const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        if (!(global.ticketGenerators.get(message.id) === undefined)) {
            console.log("deleted")
            global.ticketGenerators.delete(message.id)
        }
	},
};