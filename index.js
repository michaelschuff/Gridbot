const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { devToken, prodToken } = require('./config.json');
const { replacer, reviver, SaveData} = require("./database/loader.js");

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

fs.readFile(process.env.DEBUG == "true" ? "DEVdb.json" : "db.json", (error, data) => {
    if (error) {
        global.data = new Map();
        console.log("Could not read persistant data file: " + (process.env.DEBUG == "true" ? "DEVdb.json" : "db.json"))
    } else {
        const parsedData = JSON.parse(data, reviver);
        global.data = parsedData === undefined ? new Map() : parsedData;
        
    }
    
})

process.env.DEBUG == "true" ? client.login(devToken) : client.login(prodToken);

async function updateUTCTimers() {
    const currentTime = new Date().toUTCString().substring(17,22)

	global.data.forEach(async function(guildData, guildId, map) {
		const guild = await client.guilds.fetch(guildId)
		guildData.utcVCs.forEach(async function(id){
            const ch = await guild.channels.fetch(id)
            ch.setName(currentTime + " UTC")
		})
	})

    SaveData()
}
setInterval(updateUTCTimers, 5*60*1000); // 5 minutes worth of milliseconds