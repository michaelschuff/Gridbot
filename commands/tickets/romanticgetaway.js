const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField  } = require('discord.js');
const { SaveGlobals } = require('./../../Global.js')

module.exports = {
    emoji: '🔈',
    data: new SlashCommandBuilder()
      .setName('romanticgetaway')
      .setDescription('Creates a private voice chat that only allows two people to join')
      .addUserOption(option =>
		    option
        .setName('so')
			  .setDescription('Who is allowed to join')
            .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // only admins can use this command
      .setDMPermission(false), // cant create voice chats in dms
    async execute(interaction) {
      // Discord only gives us 3 seconds to acknowledge an interaction before
      // the interaction gets voided and can't be used anymore.
      const reply = await interaction.reply({
        content: '🫡',
      });
      const so = interaction.options.getUser('so')

      try {
        if (global.tempVCs.get(interaction.guild.id) === undefined) {
          global.tempVCs.set(interaction.guild.id, [])
          SaveGlobals();
        }
        const tempGuildVCs = global.tempVCs.get(interaction.guild.id)
        const channel = await interaction.guild.channels.create({
            name: "Paradise Island", // The name of the channel
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.member.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: so.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
            parent: interaction.channel.parent,
        });

        tempGuildVCs.push(channel)
        global.tempVCs.set(interaction.guild.id, tempGuildVCs);
        SaveGlobals();

      } catch (error) {
        console.log(error);
        await interaction.editReply({
          content:
          'Could not create romantic getaway channel, double check that bot has the correct permissions.',
        });
      }

    },
};