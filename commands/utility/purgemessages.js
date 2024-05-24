const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purgemessages')
        .setDescription('This command deletes all messages in a specified channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
        .setDMPermission(false)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('What channel to purge?')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('num')
            .setDescription('How many to delete? Default to all of them')
            .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.reply({
            content: '🫡',
            ephemeral: true
        });
        var guildData = getGuildData(interaction.guild.id);
        
        if (guildData.commandLogId != -1) {
            const channel = await interaction.guild.channels.fetch(guildData.commandLogId);
            channel.send(interaction.member.displayName + " used /purgemessages");
        }

        const channel = interaction.options.getChannel('channel');
        var num = interaction.options.getInteger('num') ?? -1;
        
        if (num == -1) {
            async function func() {
                let fetched;
                do {
                  fetched = await channel.messages.fetch({limit: 100});
                  channel.bulkDelete(fetched, true);
                }
                while(fetched.size >= 2);
            }
            await func();
        } else {
            async function func() {
                let fetched;
                do {
                    num -= min(100,num);
                  fetched = await channel.messages.fetch({limit: min(100, num)});
                  channel.bulkDelete(fetched, true);
                }
                while(fetched.size >= 2 && num > 0);
            }
            await func();
        }
    }
};