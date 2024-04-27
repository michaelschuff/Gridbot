const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");
const { TicketFactoryData } = require("./../../database/TicketFactoryData.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registrationticketgen')
        .setDescription('This command creates a registration ticket message in the channel it is used in')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false) // cant create voice chats in dms
        .addRoleOption(option => option
            .setName('role')
            .setDescription('What role handles these tickets?')),
    async execute(interaction) {
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        const role = interaction.options.getRole('role');
        const applyButton = new ButtonBuilder()
            .setCustomId('apply now')
            .setLabel('Apply Now')
            .setStyle(ButtonStyle.Success);
        
        const row = new ActionRowBuilder()
			.addComponents(applyButton);


        const applicationEmbed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('Open a ticket to apply to Gridlocke!')
            .setDescription('Click the button to open a ticket')
        
        
        const message = await interaction.channel.send({ embeds: [applicationEmbed], components: [row] });

        var buttonMap = new Map();
        buttonMap.set('apply now', [role.id])

        var newMap = new Map();
        newMap.set("id", this.id);
        newMap.set("ticketManagers",buttonMap);

        var guildData = getGuildData(interaction.guild.id);
        guildData.ticketFactories.set(message.id, new TicketFactoryData(newMap))
        setGuildData(interaction.guild.id, guildData);

        SaveData();
    }
};