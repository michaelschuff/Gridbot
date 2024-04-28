const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcommandlog')
        .setDescription('Set a channel to log commands')
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
        
        channel.send(interaction.member.displayName + " used /setcommandlog " + channel.name);
        
        var guildData = getGuildData(interaction.guild.id);
        guildData.setCommandLogId(channel.id);
        setGuildData(interaction.guildId, guildData);
        SaveData();
    }
};