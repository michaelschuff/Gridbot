const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmessagelog')
        .setDescription('Set a channel to log messages, deleted messages, and edit history')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false) // cant create voice chats in dms
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Where should logs appear?')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
    async execute(interaction) {
        const reply = await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        const channel = interaction.options.getChannel('channel');
        
        var guildData = getGuildData(interaction.guild.id);
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /setmessagelog " + channel.name);
        }
        guildData.setMessageLogId(channel.id);
        setGuildData(interaction.guildId, guildData);
        SaveData();
    }
};