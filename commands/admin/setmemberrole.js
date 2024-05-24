const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmemberrole')
        .setDescription('Set a channel to log commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false) // must have a server associated with the role
        .addRoleOption(option => option
            .setName('role')
            .setDescription('What is based, lowest level member role?')
            .setRequired(true)
        ),
    async execute(interaction) {
        const reply = await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        const role = interaction.options.getRole('role');
        
        var guildData = getGuildData(interaction.guild.id);
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /setmemberrole " + role.name);
        }
        guildData.setMemberRoleId(role.id);
        setGuildData(interaction.guildId, guildData);
        SaveData();
    }
};