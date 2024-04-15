const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { devToken, prodToken } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

global.utcVCs = new Map()
global.VCGenerators = new Map()
global.tempVCs = new Map()
async function updateUTCVoiceChannel() {
    const currentTime = new Date().toUTCString().substring(17,22)
    for (guild of global.utcVCs.entries()) {
        for (channel of guild[1]) {
            await channel.edit({ name: currentTime + " UTC" })
            .catch(console.error);
        }
    }
}
setInterval(updateUTCVoiceChannel, 60*5*1000); // 5 minutes worth of milliseconds

process.env.DEBUG == "true" ? client.login(devToken) : client.login(prodToken);
