const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    emoji: '💬',
    data: new SlashCommandBuilder()
        .setName('sendmessage')
        .setDescription('This command tells the bot to send a message with the specified content in a specified channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Where do I send the message')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('message')
            .setDescription('What should I say?')
            .setRequired(true)
        )
        .addAttachmentOption(option => option
            .setName('attachment')
            .setDescription('Any attachments?')
            .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });

        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        const attachment = interaction.options.getAttachment('attachment') ?? null;
        if (attachment != null) {
            await channel.send({content: message, files: [attachment]});
        } else {
            await channel.send(message);
        }

        
    },
};