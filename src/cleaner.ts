import { ChannelType, Client, VoiceChannel } from "discord.js";
import storage from "./storage";

function voices(client: Client){ 
    client.channels.cache.filter(c => c.type === ChannelType.GuildVoice).forEach(channel => {
        const voiceChannel = channel as VoiceChannel;
        if (voiceChannel.members.size === 0) {
            const voiceChannelStorage = storage.getVoiceChat(channel.id);
            if (voiceChannelStorage !== undefined) {
                console.log(`Removing voice channel: ${voiceChannel.name}`);
                storage.removeVoiceChat(voiceChannelStorage);
                channel.delete();
            }
        }
    });
}

export default {
    voices
}