const {prefix, token} = require('./config.json');
const { Client, Intents } = require("discord.js"),
    client = new Client({
        intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // The GUILD_VOICE_STATES and GUILDS intents are required for discord-voice to function.
    }),
    settings = {
        prefix: prefix,
        token: token
    };

// Requires Manager from discord-voice
const { VoiceManager } = require("discord-voice");
// Create a new instance of the manager class
const manager = new VoiceManager(client, {
    userStorage: "./users.json",
    configStorage: "./configs.json",
    checkMembersEvery: 5000,
    default: {
        trackBots: false,
        trackAllChannels: true
    }
});
// We now have a voiceManager property to access the manager everywhere!
client.voiceManager = manager;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "create-user") {
        message.channel.send("Ok done.");
        client.voiceManager.createUser(message.author.id, message.guild.id, {
            levelingData: {
                xp: 0,
                level: 0
            }
            // The user will have 0 xp and 0 level.
        });
    }
    if (command === "create-config") {
        message.channel.send("Ok done.");
        client.voiceManager.createConfig(message.guild.id, {
            trackBots: false, // If the user is a bot it will not be tracked.
            trackAllChannels: true, // All of the channels in the guild will be tracked.
            exemptChannels: () => false, // The user will not be tracked in these channels. (This is a function).
            channelIds: [], // The channel ids to track. (If trackAllChannels is true, this is ignored)
            exemptPermissions: [], // The user permissions to not track.
            exemptMembers: () => false, // The user will not be tracked. (This is a function).
            trackMute: true, // It will track users if they are muted aswell.
            trackDeaf: true, // It will track users if they are deafen aswell.
            minUserCountToParticipate: 0, // The min amount of users to be in a channel to be tracked.
            maxUserCountToParticipate: 0, // The max amount of users to be in a channel to be tracked.
            minXpToParticipate: 0, // The min amount of xp needed to be tracked.
            minLevelToParticipate: 0, // The min level needed to be tracked.
            maxXpToParticipate: 0, // The max amount of xp needed to be tracked.
            maxLevelToParticipate: 0, // The max level needed to be tracked.
            xpAmountToAdd: () => Math.floor(Math.random() * 10) + 1, // The amount of xp to add to the user (This is a function).
            voiceTimeToAdd: () => 1000, // The amount of time in ms to add to the user (This is a function).
            voiceTimeTrackingEnabled: true, // Whether the voiceTimeTracking module is enabled.
            levelingTrackingEnabled: true // Whether the levelingTracking module is enabled.
        });
    }
    if (command === "remove-user") {
        message.channel.send("Ok done.");
        client.voiceManager.removeUser(message.author.id, message.guild.id); // Removes the user from the database and the cache.
    }
    if (command === "remove-config") {
        message.channel.send("Ok done.");
        client.voiceManager.removeConfig(message.guild.id); // Removes the config from the database and the cache.
    }
    if (command === "edit-user") {
        switch (args[0]){
            case "xp":
                client.voiceManager.updateUser(message.author.id, message.guild.id, {
                    newLevelingData: {
                        xp: args[1],
                        level: 0
                    }
                });
                break;
            case "level":
                client.voiceManager.updateUser(message.author.id, message.guild.id, {
                    newLevelingData: {
                        xp: 0,
                        level: args[1]
                    }
                });
                break;
            case "xp-level":
                client.voiceManager.updateUser(message.author.id, message.guild.id, {
                    newLevelingData: {
                        xp: args[1],
                        level: args[2]
                    }
                });
                break;
            
            default :
                message.channel.send("Invalid argument.");
                break;
            
        }
        // client.voiceManager.updateUser(message.author.id, message.guild.id, {
        //     newVoiceTime: {
        //         channels: [],
        //         total: 0
        //     } // The new voice time user will have.
        // });
    }
    if (command === "edit-config") {
        switch (args[0]){
            case "track-bots":
                console.log(`${args[1]}`);
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackBots: `${args[1]}` === "true"
                });
                break;
            case "track-all-channels":
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackAllChannels: args[1] === "true"
                });
                break;
            case "exempt-channels":
                client.voiceManager.updateConfig(message.guild.id, {
                    newExemptChannels: () => args[1] === "true"
                });
                break;
            case "channel-ids":
                client.voiceManager.updateConfig(message.guild.id, {
                    newChannelIDs: args.slice(1)
                });
                break;
            case "exempt-permissions":
                client.voiceManager.updateConfig(message.guild.id, {
                    newExemptPermissions: args.slice(1)
                });
                break;
            case "exempt-members":
                client.voiceManager.updateConfig(message.guild.id, {
                    newExemptMembers: () => args[1] === "true"
                });
                break;
            case "track-mute":
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackMute: args[1] === "true"
                });
                break;
            case "track-deaf":
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackDeaf: args[1] === "true"
                });
                break;
            case "min-user-count-to-participate":
                const arg = `${args[1]}`;
                client.voiceManager.updateConfig(message.guild.id, {
                    newMinUserCountToParticipate: parseInt(arg)
                });
                break;
            case "max-user-count-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMaxUserCountToParticipate: parseInt(args[1])
                });
                break;
            case "min-xp-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMinXpToParticipate: parseInt(args[1])
                });
                break;
            case "min-level-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMinLevelToParticipate: parseInt(args[1])
                });
                break;
            case "max-xp-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMaxXpToParticipate: parseInt(args[1])
                });
                break;
            case "max-level-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMaxLevelToParticipate: parseInt(args[1])
                });
                break;
            case "xp-amount-to-add":
                client.voiceManager.updateConfig(message.guild.id, {
                    newXpAmountToAdd: () => parseInt(args[1])
                });
                break;
            case "voice-time-to-add":
                client.voiceManager.updateConfig(message.guild.id, {
                    newVoiceTimeToAdd: () => parseInt(args[1])
                });
                break;
            case "voice-time-tracking-enabled":
                client.voiceManager.updateConfig(message.guild.id, {
                    newVoiceTimeTrackingEnabled: args[1] === "true"
                });
                break;
            case "leveling-tracking-enabled":
                client.voiceManager.updateConfig(message.guild.id, {
                    newLevelingTrackingEnabled: args[1] === "true"
                });
                break;
            default: 
                message.channel.send("Invalid argument.");
                break;
        }
    }

});

client.login(settings.token);