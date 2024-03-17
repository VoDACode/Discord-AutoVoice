import { CacheType, CommandInteraction, Interaction, REST, Routes } from "discord.js";
import * as fs from 'fs';
import * as path from 'path';
import config from './config';

const commands: { name: string, execute: (interaction: CommandInteraction<CacheType>) => void }[] = [];

fs.readdirSync('./src/commands').forEach(file => {
    const commandName = path.basename(file, path.extname(file));
    if (file.endsWith('.ts') || file.endsWith('.js')) {
        const command = require(`./commands/${file}`);
        commands.push({
            name: commandName,
            execute: command
        });
        console.log(`Loaded command: ${commandName}`);
    }
});


const list = [
    {
        name: 'setup',
        description: 'Setup the bot for the first time',
        options: [
            {
                name: 'voice_channel',
                description: 'The voice channel to use for the bot',
                type: 7,
                required: false,
            }
        ]
    },
    {
        name: 'limit',
        description: 'Limit the number of users in the voice channel',
        options: [
            {
                name: 'number',
                description: 'The number of users to limit to',
                type: 4,
                required: true,
            }
        ]
    },
    {
        name: 'unlimit',
        description: 'Remove the user limit from the voice channel'
    }
];

export default {
    load: async () => {
        const rest = new REST({ version: '10' }).setToken(config.token);
        await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: list });
    },
    handel: async (interaction: Interaction<CacheType>) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        const command = commands.find(c => c.name === commandName);
        if (command) {
            await command.execute(interaction);
        }
    },
    list: list
}