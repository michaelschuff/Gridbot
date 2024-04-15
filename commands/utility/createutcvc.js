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
        content: 'Creating channel...',
      });

      try {
        const currentTime = new Date().toUTCString().substring(17,22)
        let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');
        // Now create the channel in the server.
        channel = await interaction.guild.channels.create({
          name: currentTime + " UTC", // The name of the channel
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionsBitField.Flags.Connect],
            }
         ],
        });


        async function updateUTCVoiceChannel(vc) {
          const currentTime = new Date().toUTCString().substring(17,22)
          await vc.edit({ name: currentTime + " UTC" })
          .catch(console.error);
        }
        setInterval(updateUTCVoiceChannel, 60*5*1000, [channel]); // 5 minutes worth of milliseconds
      } catch (error) {
        console.log(error);
        await interaction.editReply({
          content:
          'Could not create UTC channel, double check that bot has the correct permissions.',
        });
      }
    },
};