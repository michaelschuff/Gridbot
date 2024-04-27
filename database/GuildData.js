'use strict';
class GuildData {
    constructor(map) {
        if (map == null) {
            this.id = -1;
            this.utcVCs = [];
            this.tempVCs = [];
            this.VCFactories = [];
            this.ticketFactories = new Map();
            // this.commandLogId = -1;
        } else {
            const id = map.get("id");
            const utcVCs = map.get("utcVCs");
            const tempVCs = map.get("tempVCs");
            const VCFactories = map.get("VCFactories");
            const ticketFactories = map.get("ticketFactories");
            // const commandLogId = map.get("commandLogId");

            this.id = id === undefined ? -1 : id;
            this.utcVCs = utcVCs === undefined ? [] : utcVCs;
            this.tempVCs = tempVCs === undefined ? [] : tempVCs;
            this.VCFactories = VCFactories == undefined ? [] : VCFactories;
            this.ticketFactories = ticketFactories === undefined ? new Map() : ticketFactories;
            // this.commandLogId = commandLogId === undefined ? -1 : commandLogId;
        }
    }

    setCommandLogId(id) {
        this.commandLogId = id
    }

    print() {
        console.log(this.toString());
    }

    toString() {
        return  "Guild id: " + id + 
                "\nutcVCs: " + this.utcVCs + 
                "\ntempVCs: " + this.tempVCs + 
                "\nVCFactories: " + this.VCFactories + 
                "\nticketFactories: " + this.ticketFactories.toString() + 
                // "\ncommandLogId: " + this.commandLogId + 
                "\n";
    }

    toMap() {
        var newFactories = new Map();
        for (var entry of this.ticketFactories.entries()) {
            var key = entry[0];
            var value = entry[1];
            newFactories.set(key, value);
        }

        var ret = new Map();
        ret.set("id", this.id);
        ret.set("utcVCs",this.utcVCs);
        ret.set("tempVCs", this.tempVCs);
        ret.set("VCFactories", this.VCFactories);
        ret.set("ticketFactories",newFactories);
        // ret.set("commandLogId", this.commandLogId);
        return ret;
    }

}

module.exports = { GuildData };