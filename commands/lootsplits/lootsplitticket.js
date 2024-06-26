const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");
const { TicketFactoryData } = require("../../database/TicketFactoryData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lootsplitticketgen')
        .setDescription('This command creates a lootsplit ticket message in the channel it is used in')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        var guildData = getGuildData(interaction.guild.id);
        
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /lootplitticketgen");
        }


        
        const regearButton = new ButtonBuilder()
            .setCustomId('lootsplit request')
            .setLabel('Loot Split Request')
            .setStyle(ButtonStyle.Primary);
        
        const row = new ActionRowBuilder()
			.addComponents(regearButton);


        const applicationEmbed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('Open a ticket to request a loot split')
            .setDescription('Click the button to open a ticket')
        
        
        const message = await interaction.channel.send({ embeds: [applicationEmbed], components: [row] });

        var buttonMap = new Map();
        buttonMap.set('lootsplit request', [guildData.lootSplitOfficerRoleName]);

        var newMap = new Map();
        newMap.set("id", this.id);
        newMap.set("ticketManagers", buttonMap);

        guildData.ticketFactories.set(message.id, new TicketFactoryData(newMap))
        setGuildData(interaction.guild.id, guildData);
        
        SaveData();
    }
};