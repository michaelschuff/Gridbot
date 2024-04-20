const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { devToken, prodToken } = require('./config.json');
const { replacer, reviver, SaveGlobals} = require("./Global.js");

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


fs.readFile(process.env.DEBUG == "true" ? "global_dev.json" : "global.json", (error, data) => {
    if (error) {
        global.utcVCs = new Map()
        global.VCGenerators = new Map()
        global.tempVCs = new Map()
        global.ticketGenerators = new Map()
        console.log("Could not read persistant data file: " + process.env.DEBUG == "true" ? "global_dev.json" : "global.json")
    } else {
        const parsedData = JSON.parse(data, reviver);

        global.utcVCs = parsedData.utcVCs === undefined ? new Map() : parsedData.utcVCs;
        global.VCGenerators = parsedData.VCGenerators === undefined ? new Map() : parsedData.VCGenerators;
        global.tempVCs = parsedData.tempVCs === undefined ? new Map() : parsedData.tempVCs;
        global.ticketGenerators = parsedData.ticketGenerators === undefined ? new Map() : parsedData.ticketGenerators;
        SaveGlobals();
    }
    
})

process.env.DEBUG == "true" ? client.login(devToken) : client.login(prodToken);

async function update() {
    const currentTime = new Date().toUTCString().substring(17,22)
    for (guild of global.utcVCs.entries()) {
        for (channel of guild[1]) {
            const g = await client.guilds.fetch(guild[0])
            const ch = await(g.channels.fetch(channel.id))
            ch.setName(currentTime + " UTC")
        }
    }

    SaveGlobals()
}
setInterval(update, 5*60*1000); // 5 minutes worth of milliseconds