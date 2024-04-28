'use strict';
class GuildData {
    constructor(map) {
        if (map == null) {
            this.id = -1;
            this.utcVCs = [];
            this.tempVCs = [];
            this.VCFactories = [];
            this.ticketFactories = new Map();
            this.commandLogId = -1;
            this.messageLogId = -1;
            this.VCLogId = -1;
            this.userBalances = new Map();
            this.lootSplitOfficerRoleName = "";
        } else {
            const id = map.get("id");
            const utcVCs = map.get("utcVCs");
            const tempVCs = map.get("tempVCs");
            const VCFactories = map.get("VCFactories");
            const ticketFactories = map.get("ticketFactories");
            const commandLogId = map.get("commandLogId");
            const messageLogId = map.get("messageLogId");
            const VCLogId = map.get("VCLogId");
            const userBalances = map.get("userBalances");
            const lootSplitOfficerRoleName = map.get("lootSplitOfficerRoleName");

            this.id = id === undefined ? -1 : id;
            this.utcVCs = utcVCs === undefined ? [] : utcVCs;
            this.tempVCs = tempVCs === undefined ? [] : tempVCs;
            this.VCFactories = VCFactories == undefined ? [] : VCFactories;
            this.ticketFactories = ticketFactories === undefined ? new Map() : ticketFactories;
            this.commandLogId = commandLogId === undefined ? -1 : commandLogId;
            this.messageLogId = messageLogId === undefined ? -1 : messageLogId;
            this.VCLogId = VCLogId === undefined ? -1 : VCLogId;
            this.userBalances = userBalances === undefined ? new Map() : userBalances;
            this.lootSplitOfficerRoleName = lootSplitOfficerRoleName === undefined ? -1 : lootSplitOfficerRoleName;
        }
    }

    depositUserSilver(userid, silver) {
        if (this.userBalances.get(userid) === undefined) {
            this.userBalances.set(userid,0);
        }

        const currentBalance =  this.userBalances.get(userid);
        this.userBalances.set(userid, currentBalance + silver);
    }


    withdrawUserSilver(userid, silver) {
        this.depositUserSilver(userid, -silver);
    }


    transferSilver(payerid, receiverid, silver) {
        this.depositUserSilver(receiverid, silver);
        this.depositUserSilver(payerid, -silver);
    }


    getUserBalance(userid) {
        if (this.userBalances.get(userid) === undefined) {
            this.userBalances.set(userid,0);
        }
        return this.userBalances.get(userid);
    }

    setCommandLogId(id) {
        this.commandLogId = id;
    }

    setMessageLogId(id) {
        this.messageLogId = id;
    }

    setVCLogId(id) {
        this.VCLogId = id;
    }

    setLootSplitOfficerRoleName(name) {
        this.lootSplitOfficerRoleName = name;
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
                "\ncommandLogId: " + this.commandLogId + 
                "\nmessageLogId: " + this.messageLogId + 
                "\nVCLogId: " + this.VCLogId + 
                "\nuserBalances: " + this.userBalances + 
                "\nlootSplitOfficerRoleName: " + this.lootSplitOfficerRoleName + 
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
        ret.set("commandLogId", this.commandLogId);
        ret.set("messageLogId", this.messageLogId);
        ret.set("VCLogId", this.VCLogId);
        ret.set("userBalances", this.userBalances);
        ret.set("lootSplitOfficerRoleName", this.lootSplitOfficerRoleName);
        return ret;
    }

}

module.exports = { GuildData };