const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlootsplitofficerrole')
        .setDescription('What is your lootsplit officer role? (Who is allowed to use lootsplit commands)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false) // must have a server associated with it
        .addRoleOption(option => option
            .setName('role')
            .setDescription('What role is allowed to do lootsplit commands?')
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
            channel.send(interaction.member.displayName + " used /setlootsplitofficerrole " + role.name);
        }
        guildData.setLootSplitOfficerRoleName(role.name);
        setGuildData(interaction.guildId, guildData);
        SaveData();
    }
};