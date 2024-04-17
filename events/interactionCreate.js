const { Events, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId == 'apply now') {
                var category = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == "applications");
                if (!category) {
                    category = await interaction.guild.channels.create({
                        name: "applications", 
                        type: ChannelType.GuildCategory,
                    });
                }
                const channel = await category.children.create({
                    name: interaction.member.user.username + "'s application'",
                    type: ChannelType.GuildText
                })

                const applyButton = new ButtonBuilder()
                    .setCustomId('close ticket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger);
                
                const row = new ActionRowBuilder()
                    .addComponents(applyButton);


                const applicationEmbed = new EmbedBuilder()
                    .setColor(0xFFA500)
                    .setTitle('Please answer the following questions')
                    .setDescription('- What brought you to Gridlocke?\n- What are your in-game main role ?\n- What is your main playtime in UTC?\n- Do you play on PC, Mobile or both?\n- Are you at least 18 Y/O?\n- Do you play any other online games?\n- Please type your IGN:\n- Please include a screenshot of your login screen/Character stats')
                
                
                
                await channel.send({ embeds: [applicationEmbed], components: [row] });
            }

            if (interaction.customId == 'close ticket') {
                await interaction.channel.delete();
            }
            return;
        }

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
            return;
        }
		
	},
};