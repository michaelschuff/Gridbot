const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewbalance')
        .setDescription('View your current loot split balance')
        .setDMPermission(false),
    async execute(interaction) {
        var guildData = getGuildData(interaction.guild.id);
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /viewbalance ");
        }
        const balance = guildData.getUserBalance(interaction.member.user.id);
        const reply = await interaction.reply({
            content: `You have ${balance} silver`,
            ephemeral: true
        });
        
        // setGuildData(interaction.guildId, guildData);
        // SaveData();
    }
};