import fs from 'fs';

export interface Config {
    token: string;
    clientId: string;
    guildId: string;
    parentVoiceChannelId: string;
}

let _config: Config = {} as Config;
try {
    _config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    console.log('Config file found');
} catch (error) {
    console.error('Config file not found');
    process.exit(1);
}

function updateConfig(newConfig: Config) {
    _config = newConfig;
    fs.writeFileSync('./config.json', JSON.stringify(newConfig, null, 4));
}

const observer = new Proxy(_config, {
    set: (target, property, value) => {
        target[property as keyof Config] = value;
        updateConfig(target);
        return true;
    },
    get: (target, property) => {
        return target[property as keyof Config];
    }
});

export default observer;