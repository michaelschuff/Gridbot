const fs = require('node:fs');
const { GuildData } = require('./GuildData.js')
const { TicketFactoryData } = require('./TicketFactoryData.js')

// Functions for saving Maps in json files
function replacer(key, value) {
    if(value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else if (value instanceof GuildData) {
        return {
            dataType: 'GuildData',
            value: Array.from(value.toMap().entries())
        }
    } else if (value instanceof TicketFactoryData) {
        return {
            dataType: 'TicketFactoryData',
            value: Array.from(value.toMap().entries())
        }
    } else {
        return value;
    }
}
function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        } else if (value.dataType === 'GuildData') {
            return new GuildData(new Map(value.value));
        } else if (value.dataType === 'TicketFactoryData') {
            return new TicketFactoryData(new Map(value.value));
        }
    }
    return value;
}

async function SaveData() {
    const data = JSON.stringify(global.data, replacer)
    
    
    fs.writeFile(process.env.DEBUG == "true" ? "DEVdb.json" : "db.json", data, (error) => {
        if (error) {
            console.error(error);
        }
    });
}

function getGuildData(guildId) {
    if (guildId == -1) {
        return null;
    }

    var guildData = global.data.get(guildId);

    if (guildData === undefined) {
        guildData = new GuildData(new Map());
        guildData.id = guildId;
    }
    return guildData;
}

function setGuildData(guildId, guildData) {
    global.data.set(guildId, guildData);
}



module.exports = { replacer, reviver, SaveData, getGuildData, setGuildData };