const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    emoji: '🔈',
    data: new SlashCommandBuilder()
        .setName('createutcvc')
        .setDescription('This command creates a locked voice channel that displays the current UTC time.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false), // cant create voice chats in dms
    async execute(interaction) {
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        var guildData = getGuildData(interaction.guild.id);
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /createutcvc");
        }
        

        const currentTime = new Date().toUTCString().substring(17,22);
        const channel = await interaction.guild.channels.create({
            name: currentTime + " UTC", // The name of the channel
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.Connect],
                }
            ],
        });
        guildData.utcVCs.push(channel.id);
        setGuildData(interaction.guild.id, guildData);
        SaveData();
        
    },
};