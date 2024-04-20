const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveGlobals } = require('./../../Global.js')

module.exports = {
    emoji: '🔈',
    data: new SlashCommandBuilder()
      .setName('createtempvcgenerator')
      .setDescription('This command creates a locked voice channel that displays the current UTC time.')
      .addStringOption(option =>
		option
            .setName('name')
			.setDescription('The name of the channel')
            .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
      .setDMPermission(false), // cant create voice chats in dms
    async execute(interaction) {
      // Discord only gives us 3 seconds to acknowledge an interaction before
      // the interaction gets voided and can't be used anymore.
      await interaction.reply({
        content: '🫡',
      });

      const name = interaction.options.getString('name')

      try {
        if (global.VCGenerators.get(interaction.guild.id) === undefined) {
          global.VCGenerators.set(interaction.guild.id, [])
          SaveGlobals();
        }
        
        var newChannels = global.VCGenerators.get(interaction.guild.id) 
        newChannels.push(await interaction.guild.channels.create({
          name: name, // The name of the channel
          type: ChannelType.GuildVoice
        }))
        global.VCGenerators.set(interaction.guild.id, newChannels);
        SaveGlobals();
      } catch (error) {
        console.log(error);
        await interaction.editReply({
          content:
          'Could not create VC generator channel, double check that bot has the correct permissions.',
        });
      }
    },
};