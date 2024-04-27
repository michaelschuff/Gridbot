'use strict';

class TicketFactoryData {
    constructor(map) {
        if (map == null) {
            this.id = -1;
            this.ticketManagers = new Map();
        } else {
            const id = map.get("id");
            const ticketManagers = map.get("ticketManagers");

            this.id = id === undefined ? -1 : id;
            this.ticketManagers = ticketManagers === undefined ? new Map() : ticketManagers;
        }
    }

    print() {
        console.log(this.toString());
    }

    toString() {
        return  "Message id: " + id + 
                "\nticketManagers: " + this.ticketManagers + 
                "\n";
    }

    toMap() {
        var ret = new Map();
        ret.set("id", this.id);
        ret.set("ticketManagers",this.ticketManagers);
        return ret;
    }
}


module.exports = { TicketFactoryData };