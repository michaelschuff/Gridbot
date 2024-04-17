const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createapplicationticketgen')
        .setDescription('This command creates a registration ticket message in the channel it is used in')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false), // cant create voice chats in dms
    async execute(interaction) {
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
        
        
        await interaction.channel.send({ embeds: [applicationEmbed], components: [row] });
    }
};