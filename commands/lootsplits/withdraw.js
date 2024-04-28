const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw silver from a user\'s account to give to them in game.')
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription('Who is withdrawing?')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('How much? Default: all')
        ),
    async execute(interaction) {
        var guildData = getGuildData(interaction.guild.id);
        if (interaction.member.roles.cache.some(r => r.name === guildData.lootSplitOfficerRoleName)) {
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount') ?? guildData.getUserBalance(user.id);
            
            if (guildData.commandLogId != -1) {
                const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
                channel.send(interaction.member.displayName + " used /withdraw " + user + " " + amount);
            }


            const oldBalance = guildData.getUserBalance(user.id);
            const reply = await interaction.reply({
                content: `Withdrew ${amount} silver from ${user.displayName}.\n\`Old balance: ${oldBalance}\`\n\`New balance: ${oldBalance - amount}\``,
                ephemeral: true
            });
            guildData.withdrawUserSilver(user.id, amount);
            
            setGuildData(interaction.guildId, guildData);
            SaveData();
        } else {
            await interaction.reply({
                content: 'You are not a loot split officer',
                ephemeral: true
            });
        }
    }
};