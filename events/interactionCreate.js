const { Events, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const { getGuildData, setGuildData } = require("./../database/loader.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId == 'apply now') {
                await interaction.reply({
                    content: '🫡',
                    ephemeral: true
                });

                var guildData = getGuildData(interaction.guild.id);
                const ticketFactoryData = guildData.ticketFactories.get(interaction.message.id);

                var category = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == "applications");
                if (!category) {
                    category = await interaction.guild.channels.create({
                        name: "applications", 
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },{
                                id: ticketFactoryData.ticketManagers.get(interaction.customId)[0], // could ping multiple roles, just ping one.
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            }
                        ],
                    });
                }
                const channel = await category.children.create({
                    name: interaction.member.displayName + "'s application'",
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        }, {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }, {
                            id: ticketFactoryData.ticketManagers.get(interaction.customId)[0], // could ping multiple roles, just ping one.
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }
                    ],
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
                await channel.send("<@" + interaction.member.user.id + ">");
                if (!(guildData.ticketFactories.get(interaction.message.id) === undefined)) {
                    await channel.send("<@&" + ticketFactoryData.ticketManagers.get(interaction.customId) + ">");
                }
            }

            if (interaction.customId == 'regear request') {
                await interaction.reply({
                    content: '🫡',
                    ephemeral: true
                });

                var guildData = getGuildData(interaction.guild.id);

                const ticketFactoryData = guildData.ticketFactories.get(interaction.message.id);
                var category = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == "regears");
                if (!category) {
                    category = await interaction.guild.channels.create({
                        name: "regears", 
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },{
                                id: ticketFactoryData.ticketManagers.get(interaction.customId)[0], // could ping multiple roles, just ping one.
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            }
                        ],
                    });
                }
                
                const channel = await category.children.create({
                    name: interaction.member.displayName + "'s regear'",
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        }, {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }, {
                            id: ticketFactoryData.ticketManagers.get(interaction.customId)[0], // could ping multiple roles, just ping one.
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }
                    ],
                })

                const applyButton = new ButtonBuilder()
                    .setCustomId('close ticket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger);
                
                const row = new ActionRowBuilder()
                    .addComponents(applyButton);


                const applicationEmbed = new EmbedBuilder()
                    .setColor(0xFFA500)
                    .setTitle('Please post the following to receive your regear')
                    .setDescription('- Date and time of the content you died in\n- Name of the caller running the content\n- Screenshot of your death (see example)')
                    .setImage('https://media.discordapp.net/attachments/1231318288638803988/1231318321803169893/RegearDeathExample.png?ex=6636858c&is=6624108c&hm=14506cfb212001ac037935b1407afc32af91e4e7dfe0a26cb9196e4704a4c624&=&format=webp&quality=lossless&width=1384&height=1060')
                
                
                await channel.send({ embeds: [applicationEmbed], components: [row] });
                await channel.send("<@" + interaction.member.user.id + ">");
                if (!(guildData.ticketFactories.get(interaction.message.id) === undefined)) {
                    await channel.send("<@&" + ticketFactoryData.ticketManagers.get(interaction.customId) + ">");
                }
            }

            if (interaction.customId == 'lootsplit request') {
                await interaction.reply({
                    content: '🫡',
                    ephemeral: true
                });

                var guildData = getGuildData(interaction.guild.id);

                const ticketFactoryData = guildData.ticketFactories.get(interaction.message.id);
                var category = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == "lootsplits");
                let role = interaction.guild.roles.cache.find(r => r.name == ticketFactoryData.ticketManagers.get(interaction.customId)[0]);
                // console.log(role)
                if (!category) {
                    category = await interaction.guild.channels.create({
                        name: "lootsplits", 
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },{
                                id: role.id, // could ping multiple roles, just ping one.
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            }
                        ],
                    });
                }
                
                const channel = await category.children.create({
                    name: interaction.member.displayName + "'s lootsplit request",
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        }, {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }, {
                            id: role.id, // could ping multiple roles, just ping one.
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }
                    ],
                })


                const applyButton = new ButtonBuilder()
                    .setCustomId('close ticket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger);
                
                const row = new ActionRowBuilder()
                    .addComponents(applyButton);


                const applicationEmbed = new EmbedBuilder()
                    .setColor(0xFFA500)
                    .setTitle('Please post the following to request your lootsplit')
                    .setDescription('- A screenshot of each party involved\n- The value of the chest loot\n- The cost to repair the gear\n- The amount of silver bags.')
                
                
                await channel.send({ embeds: [applicationEmbed], components: [row] });
                await channel.send("<@" + interaction.member.user.id + ">");
                if (!(guildData.ticketFactories.get(interaction.message.id) === undefined)) {
                    await channel.send("<@&" + role.id + ">");
                }
            }

            if (interaction.customId == 'close ticket') {
                setTimeout(async () => {
                    await interaction.channel.delete();
                }, 1000)
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