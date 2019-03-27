// imports
const Discord = require("discord.js");
const commandFactory = require('./command.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = require("../config.json");

// create client and collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

// generate commands from data files
	client.commands.set(commandData.name, commandFactory(commandData));
const commandData = yaml.safeLoad(fs.readFileSync(config.yml, 'utf8'));
commandData.forEach((commandDatum) => {
	client.commands.set(commandDatum.name, commandFactory(commandDatum));
});

client.on("ready", () => {
	console.log('Ready');
});

// import configs 
const prefix = config.prefix;
client.on('message', message => {
	// check for Prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// strip args and commands
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// execute command
	const command = client.commands.get(commandName);
	if (command) {
		command.execute(message, args, dynamicConfigs);
	}
});

client.login(config.token);