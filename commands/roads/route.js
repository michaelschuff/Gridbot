const { SlashCommandBuilder } = require('discord.js');
const { Roads, Cities, NonCityZones, CitiesAndHideoutZones } = require('../../assets/MapNames.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('route')
		.setDescription('Display a message detailing a roads connection')
        .addStringOption(option =>
            option.setName('start')
                .setDescription('Start location (city or hideout zone)')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('finish')
                .setDescription('End location (city or hideout zone)')
                .setRequired(true)
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('hours')
                .setDescription('The number of hours left on the portal open the longest.')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(23))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('The number of minutes left on the portal open the longest.')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(60))
        .addStringOption(option =>
            option.setName('royal1')
                .setDescription('Royal Continent or Outlands connection')
                .setRequired(false)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('road2')
                .setDescription('First road connection')
                .setRequired(false)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('royal3')
                .setDescription('Royal Continent or Outlands connection')
                .setRequired(false)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('road4')
                .setDescription('First road connection')
                .setRequired(false)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('royal5')
                .setDescription('Royal Continent or Outlands connection')
                .setRequired(false)
                .setAutocomplete(true)),
	category: 'roads',
    async autocomplete(interaction) {
        let filtered;
		const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name == 'start' || focusedOption.name == 'finish' ) {
            if (2 <= focusedOption.value.length && focusedOption.value.length <= 3) {
                filtered = CitiesAndHideoutZones.filter(choice => choice.name[0] == focusedOption.value[0] &&
                                                  choice.name[choice.name.indexOf('-')+1] == focusedOption.value[1]);
                if (focusedOption.value.length == 3) {
                    filtered = filtered.filter(choice => choice.name[choice.name.indexOf('-')+4] == focusedOption.value[2]);
                }
                filtered = filtered.concat(CitiesAndHideoutZones.filter(choice => choice.name.startsWith(focusedOption.value)));
            } else {
                filtered = CitiesAndHideoutZones.filter(choice => choice.name.startsWith(focusedOption.value));
            }
        } else if (focusedOption.name == 'royal1' || focusedOption.name == 'royal3' || focusedOption.name == 'royal5') {
            filtered = NonCityZones.filter(choice => choice.name.startsWith(focusedOption.value));
        } else if (focusedOption.name === 'road2' || focusedOption.name === 'road4') {
            if (2 <= focusedOption.value.length && focusedOption.value.length <= 3) {
                filtered = Roads.filter(choice => choice.name[0] == focusedOption.value[0] &&
                                                  choice.name[choice.name.indexOf('-')+1] == focusedOption.value[1]);
                if (focusedOption.value.length == 3) {
                    filtered = filtered.filter(choice => choice.name[choice.name.indexOf('-')+4] == focusedOption.value[2]);
                }
            } else {
                filtered = Roads.filter(choice => choice.name.startsWith(focusedOption.value));
            }
            
        } else {
            filtered = [];
        }
		
        filtered = filtered.slice(0,25);
		await interaction.respond(
			filtered
		);
	},
	async execute(interaction) {
        const start = interaction.options.getString('start');
        const finish = interaction.options.getString('finish');
        const royal1 = interaction.options.getString('royal1') ?? '';
        const royal3 = interaction.options.getString('royal3') ?? '';
        const royal5 = interaction.options.getString('royal5') ?? '';
        const road2 = interaction.options.getString('road2') ?? '';
        const road4 = interaction.options.getString('road4') ?? '';
        const hours = Math.max(interaction.options.getInteger('hours'),0);
        const minutes = Math.max(interaction.options.getInteger('minutes'),0);

        let msg = start;
        if (royal1 != "") { msg += " -> " + royal1; }
        if (road2 != "")  { msg += " -> " + road2; }
        if (royal3 != "") { msg += " -> " + royal3; }
        if (road4 != "")  { msg += " -> " + road4; }
        if (royal5 != "") { msg += " -> " + royal5; }
        msg += " -> " + finish;

        let utc = Math.round(Date.now() / 1000) + hours * 60 * 60 + minutes * 60;
        msg += '\nCloses <t:' + utc + ':R>';
        await interaction.reply({
            content: msg,
        }).then(message => {
            setTimeout(() => message.delete(), hours * 60 * 60 * 1000 + minutes * 60 * 1000)
        });
	},
};
