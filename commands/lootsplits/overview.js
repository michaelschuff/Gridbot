const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('overview')
        .setDescription('View all current balances')
        .setDMPermission(false),
    async execute(interaction) {
        var guildData = getGuildData(interaction.guild.id);
        if (interaction.member.roles.cache.some(r => r.name === guildData.lootSplitOfficerRoleName)) {
            if (guildData.commandLogId != -1) {
                const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
                channel.send(interaction.member.displayName + " used /overview ");
            }
            const balances = guildData.userBalances;
            var str = ``;
            if (balances.size != 0) {
                balances.forEach((value, key, map) => {
                    str += `<@${key}>:  ${value}\n`;
                })
                const reply = await interaction.reply({
                    content: str,
                    ephemeral: true
                });
            } else {
                const reply = await interaction.reply({
                    content: 'No one has a balance',
                    ephemeral: true
                });
            }
            
            // setGuildData(interaction.guildId, guildData);
            // SaveData();
        } else {
            await interaction.reply({
                content: 'You are not a loot split officer',
                ephemeral: true
            });
        }
    }
};