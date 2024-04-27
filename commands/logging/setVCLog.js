const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setvclog')
        .setDescription('Set a channel to log voice chat history')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false) // cant create voice chats in dms
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Where should logs appear?')),
    async execute(interaction) {
        const reply = await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        const channel = interaction.options.getChannel('channel');
        
        var guildData = getGuildData(interaction.guild.id);
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /setvclog " + channel.id);
        }
        guildData.setVCLogId(channel.id);
        setGuildData(interaction.guildId, guildData);
        SaveData();
    }
};