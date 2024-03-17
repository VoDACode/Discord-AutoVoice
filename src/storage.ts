import fs from 'fs';
import { VoiceChatModel } from './models/voiceChatModel';

const voiceChats: {[id: string]: VoiceChatModel} = {};
try {
    const voiceChatsData = JSON.parse(fs.readFileSync('./voiceChats.json', 'utf-8'));
    for (const key in voiceChatsData) {
        voiceChats[key] = new VoiceChatModel(
            voiceChatsData[key].id,
            voiceChatsData[key].owner,
            new Date(voiceChatsData[key].createdAt),
            voiceChatsData[key].limit
        );
    }
    console.log('VoiceChats file found');
} catch (error) {
    fs.writeFileSync('./voiceChats.json', JSON.stringify(voiceChats, null, 4));
    console.error('VoiceChats file created');
}

function getVoiceChats() {
    return voiceChats;
}

function getVoiceChat(id: string) {
    return voiceChats[id];
}

function addVoiceChat(voiceChat: VoiceChatModel) {
    voiceChats[voiceChat.id] = voiceChat;
    fs.writeFileSync('./voiceChats.json', JSON.stringify(voiceChats, null, 4));
}

function removeVoiceChat(voiceChat: VoiceChatModel) {
    const obj = voiceChats[voiceChat.id]
    if (obj == undefined) return;
    delete voiceChats[voiceChat.id];
    fs.writeFileSync('./voiceChats.json', JSON.stringify(voiceChats, null, 4));
}

function updateVoiceChat(voiceChat: VoiceChatModel) {
    voiceChats[voiceChat.id] = voiceChat;
    fs.writeFileSync('./voiceChats.json', JSON.stringify(voiceChats, null, 4));
}

export default {
    getVoiceChat,
    getVoiceChats,
    addVoiceChat,
    removeVoiceChat,
    updateVoiceChat
};