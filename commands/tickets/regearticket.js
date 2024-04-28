const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");
const { TicketFactoryData } = require("../../database/TicketFactoryData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('regearticketgen')
        .setDescription('This command creates a regear ticket message in the channel it is used in')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false) // cant create voice chats in dms
        .addRoleOption(option => option
            .setName('role')
            .setDescription('What role handles these tickets?')
        ),
    async execute(interaction) {
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        const role = interaction.options.getRole('role');
        var guildData = getGuildData(interaction.guild.id);
        
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /regearticketgen " + role);
        }


        
        const regearButton = new ButtonBuilder()
            .setCustomId('regear request')
            .setLabel('Request Regear')
            .setStyle(ButtonStyle.Primary);
        
        const row = new ActionRowBuilder()
			.addComponents(regearButton);


        const applicationEmbed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('Open a ticket to request your regear')
            .setDescription('Click the button to open a ticket')
        
        
        const message = await interaction.channel.send({ embeds: [applicationEmbed], components: [row] });

        var buttonMap = new Map();
        buttonMap.set('regear request', [role.id])

        var newMap = new Map();
        newMap.set("id", this.id);
        newMap.set("ticketManagers",buttonMap);

        guildData.ticketFactories.set(message.id, new TicketFactoryData(newMap))
        setGuildData(interaction.guild.id, guildData);
        
        SaveData();
    }
};