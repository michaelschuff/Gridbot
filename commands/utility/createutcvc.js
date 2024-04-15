const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
module.exports = {
    emoji: '🔈',
    data: new SlashCommandBuilder()
      .setName('createutcvc')
      .setDescription('This command creates a locked voice channel that displays the current UTC time.')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
      .setDMPermission(false), // cant create voice chats in dms
    async execute(interaction) {
      // Discord only gives us 3 seconds to acknowledge an interaction before
      // the interaction gets voided and can't be used anymore.
      await interaction.reply({
        content: '🫡',
      });

      try {
        const currentTime = new Date().toUTCString().substring(17,22)
        // Now create the channel in the server.
        if (global.utcVCs === undefined)
          global.utcVCs = new Map()
  
        if (global.utcVCs.get(interaction.guild.id) === undefined)
          global.utcVCs.set(interaction.guild.id, [])
        
        var newChannels = global.utcVCs.get(interaction.guild.id) 
        newChannels.push(await interaction.guild.channels.create({
          name: currentTime + " UTC", // The name of the channel
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionsBitField.Flags.Connect],
            }
         ],
        }))
        global.utcVCs.set(interaction.guild.id, newChannels);
      } catch (error) {
        console.log(error);
        await interaction.editReply({
          content:
          'Could not create UTC channel, double check that bot has the correct permissions.',
        });
      }
    },
};