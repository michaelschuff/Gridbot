const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveData, getGuildData, setGuildData } = require("./../../database/loader.js");
const { TicketFactoryData } = require("../../database/TicketFactoryData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lootsplit')
        .setDescription('This command calculates a loot split')
        .setDMPermission(false)
        .addIntegerOption(option => option
            .setName('chest_value')
            .setDescription('What is the silver value of the split (excluding silver bags)?')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('repair_cost')
            .setDescription('What is the cost of repairing all the damaged gear?')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('silver_bags')
            .setDescription('What is the value of silver bags?')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('participants')
            .setDescription('Ping the members that participated in this event')
            .setRequired(true)
        ),
    async execute(interaction) {
        
        var guildData = getGuildData(interaction.guild.id);
        if (interaction.member.roles.cache.some(r => r.name === guildData.lootSplitOfficerRoleName)) {
            const chestValue = interaction.options.getInteger('chest_value');
            const fee = Math.round(chestValue * 0.2);
            const repairCost = interaction.options.getInteger('repair_cost');
            const afterRepairValue = chestValue - fee - repairCost;
            const silverBags = interaction.options.getInteger('silver_bags') ?? 0;
            const afterBagsValue = afterRepairValue + silverBags;
            var participants = interaction.options.getString('participants');
            participants = participants.replace(/\s/g,'');
            participants = participants.substring(1, participants.length - 1);
            participants = participants.split('><');
            participants.forEach((value, index, participants) => {
                participants[index] = value.substring(1, value.length);
            })
            const numGamers = participants.length;
            const gamerSplit = Math.round(afterBagsValue / numGamers);
            const spltmsg = `\`\`\`chest value:        ${chestValue}\n` + 
                            `fee:                ${fee}\n` + 
                            `repair cost:        ${repairCost}\n` + 
                            `after repair value: ${afterRepairValue}\n` + 
                            `silver bags:        ${silverBags}\n` + 
                            `after bags value:   ${afterBagsValue}\n` + 
                            `number of gamers:   ${numGamers}` + 
                            `gamer split:        ${gamerSplit}\n\`\`\``;
            await interaction.reply({
                content: spltmsg,
            });


            participants.forEach((value) => {
                guildData.depositUserSilver(value, gamerSplit);
            })
            
            
            setGuildData(interaction.guild.id, guildData);
            
            SaveData();

        } else {
            await interaction.reply({
                content: 'You are not a loot split officer',
                ephemeral: true
            });
        }
    }
};