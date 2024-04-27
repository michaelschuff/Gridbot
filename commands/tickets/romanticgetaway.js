const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    emoji: '🔈',
    data: new SlashCommandBuilder()
        .setName('romanticgetaway')
        .setDescription('Creates a private voice chat that only allows two people to join')
        .addUserOption(option => option
            .setName('so')
			.setDescription('Who is allowed to join')
            .setRequired(true))
            .setDMPermission(false), // cant create voice chats in dms
    async execute(interaction) {
        // Discord only gives us 3 seconds to acknowledge an interaction before
        // the interaction gets voided and can't be used anymore.
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        const so = interaction.options.getUser('so');

        var guildData = getGuildData(interaction.guild.id);
        
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /romanticgetaway " + so.displayName);
        }

        const channel = await interaction.guild.channels.create({
            name: "Paradise Island", // The name of the channel
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                }, {
                    id: interaction.member.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                }, {
                    id: so.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                }
            ],
            parent: interaction.channel.parent,
        });
        guildData.tempVCs.push(channel.id);
        setGuildData(interaction.guild.id, guildData);
        
        SaveData();
    },
};