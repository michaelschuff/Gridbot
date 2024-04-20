const fs = require('node:fs');

function replacer(key, value) {
    if(value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

async function SaveGlobals() {
    const obj = {
        utcVCs: global.utcVCs,
        VCGenerators: global.VCGenerators,
        tempVCs: global.tempVCs,
        ticketGenerators: global.ticketGenerators,
    }
    const data = JSON.stringify(obj, replacer)
    
    
    fs.writeFile(process.env.DEBUG == "true" ? "global_dev.json" : "global.json", data, (error) => {
        if (error) {
            console.error(error);
            throw error;
        }
    });
}

module.exports = { SaveGlobals, replacer, reviver };