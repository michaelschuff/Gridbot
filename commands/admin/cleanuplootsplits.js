const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleanuplootsplits')
        .setDescription('Cleanup lootsplits accounts. Delete zerod accounts and deleted users.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false),
    async execute(interaction) {
        var guildData = getGuildData(interaction.guild.id);
        
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /cleanuplootsplits");
        }
        let balances = guildData.userBalances;
        var toDelete = []
        var str = "Removed: "
        balances.forEach(async (value, key, balances) => {
            if (value == 0) {
                toDelete.push(key)
                str += `<@${key}>: ${value}\n`;
            }
            
            const isMember = await interaction.guild.members.fetch(key).then(() => true).catch(() => false);
            if (isMember) {
                toDelete.push(key)
                str += `<@${key}>: ${value}\n`;
            }
        });
        if (str == "Removed: ") {
            str = "No lootsplits need cleaning"
        }

        toDelete.forEach((value, index, toDelete) => {
            balances.delete(value);
            
        }) 

        guildData.userBalances = balances;




        const reply = await interaction.reply({
            content: str,
            ephemeral: true
        });
        
        setGuildData(interaction.guildId, guildData);
        SaveData();
    }
};