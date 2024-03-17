import { CacheType, ChannelType, CommandInteraction, Interaction, PermissionsBitField } from "discord.js";
import config from '../config';

async function execute(interaction: CommandInteraction<CacheType>) {
    const member = interaction.member;
    if (!member) return;
    let permissions: PermissionsBitField | undefined = undefined;
    if (typeof member.permissions === 'string') {
        permissions = new PermissionsBitField(BigInt(member.permissions));
    }else {
        permissions = new PermissionsBitField(member.permissions);
    }
    if (!permissions.has('Administrator', true)) {
        await interaction.reply({ ephemeral: true, content: 'You must be an administrator to use this command' });
        return;
    }

    const voiceChannel = interaction.options.get('voice_channel');
    if (!voiceChannel) {
        const voiceChannel = interaction.guild?.channels.cache.find(channel => channel.type === ChannelType.GuildVoice && channel.id == config.parentVoiceChannelId);
        if (voiceChannel === undefined) {
            await interaction.reply({ ephemeral: true, content: 'No voice channel found' });
            return;
        }
    }else{
        config.parentVoiceChannelId = voiceChannel.value as string;
    }
    await interaction.reply({ ephemeral: true, content: `Setting up in ${voiceChannel}` });
}

export default execute;
module.exports = execute;