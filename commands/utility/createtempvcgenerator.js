const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField} = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    emoji: '🔈',
    data: new SlashCommandBuilder()
        .setName('createtempvcgenerator')
        .setDescription('This command creates a locked voice channel that displays the current UTC time.')
        .addStringOption(option => option
            .setName('name')
			.setDescription('The name of the channel')
            .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
            .setDMPermission(false), // cant create voice chats in dms
    async execute(interaction) {
        // Discord only gives us 3 seconds to acknowledge an interaction before
        // the interaction gets voided and can't be used anymore.
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });

        const name = interaction.options.getString('name');
        
        var guildData = getGuildData(interaction.guild.id);
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /createtempvcgenerator " + name);
        }

        const channel = await interaction.guild.channels.create({
            name: name, // The name of the channel
            type: ChannelType.GuildVoice
        });
        guildData.VCFactories.push(channel.id);

        setGuildData(interaction.guild.id, guildData);
        SaveData();
    },
};