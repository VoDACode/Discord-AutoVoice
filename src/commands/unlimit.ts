import { CacheType, ChannelType, CommandInteraction, Interaction, PermissionsBitField } from "discord.js";
import storage from "../storage";
import config from '../config';

async function execute(interaction: CommandInteraction<CacheType>) {
    const member = interaction.member;
    if (!member) return;
    const userId = member.user.id;
    // currentVoiceChannel where the user is
    const currentVoiceChannel = interaction.guild?.members.cache.get(userId)?.voice.channelId;
    if (currentVoiceChannel == undefined) {
        await interaction.reply({ ephemeral: true, content: 'You must be in a voice channel to use this command' });
        return;
    }

    var voiceChat = storage.getVoiceChat(currentVoiceChannel);
    if (voiceChat === undefined) {
        await interaction.reply({ ephemeral: true, content: 'This is not a auto created voice channel' });
        return;
    }
    if (voiceChat.owner !== userId) {
        await interaction.reply({ ephemeral: true, content: 'You are not the owner of this voice channel' });
        return;
    }

    // set the limit on the voice channel
    const voiceChannel = interaction.guild?.channels.cache.get(currentVoiceChannel);
    if (voiceChannel === undefined) {
        await interaction.reply({ ephemeral: true, content: 'No voice channel found' });
        return;
    }
    if (voiceChannel.type !== ChannelType.GuildVoice) {
        await interaction.reply({ ephemeral: true, content: 'You must be in a voice channel to use this command' });
        return;
    }
    await voiceChannel.setUserLimit(0);
    await interaction.reply({ ephemeral: true, content: `User limit removed` });
}

export default execute;
module.exports = execute;