const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmessagelog')
        .setDescription('Set a channel to log messages, deleted messages, and edit history')
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
        

        //TODO
        
    }
};