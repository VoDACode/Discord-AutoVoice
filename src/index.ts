import config from './config';
import commands from './commands';
import { ChannelType, Client, GatewayIntentBits, GuildChannel, PermissionsBitField, REST, Routes } from 'discord.js';
import storage from './storage';
import cleaner from './cleaner';

(async () => {

    await commands.load();

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

    client.once('ready', async () => {
        console.log('Bot is ready!');
        await cleaner.voices(client);
    });

    client.on('voiceStateUpdate', async (oldState, newState) => {
        try {
            if (newState.channel !== null) {
                if (newState.channel.id === config.parentVoiceChannelId) {
                    if (newState.member === null) return;
                    // create new voice channel in the same category
                    const userNickname = newState.member?.nickname || newState.member?.user.username;
                    const newVoiceChannel = await newState.guild.channels.create({
                        name: `${userNickname}'s Channel`,
                        type: ChannelType.GuildVoice,
                        parent: newState.channel.parent
                    });

                    // move the user to the new voice channel
                    newState.setChannel(newVoiceChannel);

                    // add the new voice channel to the storage
                    storage.addVoiceChat({
                        id: newVoiceChannel.id,
                        owner: newState.member?.id,
                        createdAt: new Date(),
                        limit: null
                    });
                }
            }
            if (oldState.channel !== null) {
                if (oldState.channel.members.size === 0) {
                    const voiceChat = storage.getVoiceChat(oldState.channel.id);
                    if (voiceChat !== undefined) {
                        // remove the voice channel from the storage
                        storage.removeVoiceChat(voiceChat);
                        // delete the voice channel
                        oldState.channel.delete();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            console.log('If this is a bug, please report it to the developer');
        }
    });

    client.on('interactionCreate', async interaction => {
        try {
            await commands.handel(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.isCommand()) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            console.log('If this is a bug, please report it to the developer');
        }
    });

    client.login(config.token);
})();
