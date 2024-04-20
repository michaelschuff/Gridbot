const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('regearticketgen')
        .setDescription('This command creates a regear ticket message in the channel it is used in')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false) // cant create voice chats in dms
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('What role handles these tickets?')),
    async execute(interaction) {
        const reply = await interaction.reply({
          content: '🫡',
          ephemeral: true
        });
        const role = interaction.options.getRole('role');
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

        global.ticketGenerators.set(message.id, role.id)
        SaveGlobals();
    }
};