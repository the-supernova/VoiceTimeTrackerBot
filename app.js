const { prefix, token } = require('./config.json');
const { MessageEmbed } = require('discord.js');
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
    userStorage: "./db/users.json",
    configStorage: "./db/configs.json",
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

    if (command === "help"){
        const embed = new MessageEmbed()
            .setTitle("Help")
            .setDescription("Here is the list of available commands! Use `!v` before them")
            .setThumbnail("https://i.imgur.com/4KVqtpu.png")
            .addFields(
                { name: "create-user", value: "Creates a new user"},
                { name: "create-config", value: "Creates a new config"},
                { name: "remove-user", value: "Removes the user from the database and the cache"},
                { name: "remove-config", value: "Removes the config from the database and the cache"},
                { name: "edit-user", value: "Edits a user's data\nFor various sub-commands and their arguments, type `edit-user-help`"},
                { name: "edit-config", value: "Edits a config's data\nFor various sub-commands and their arguments, type `edit-config-help`"},
                { name: "fetch-id", value: "Get current userId(`fetch-id user <username>`) or guildId(`fetch-id guild`)"},
                { name: "fetch-user", value: "Get the list of all users(`fetch-user all`), specific to user(`fetch-user user <id>`) or guild(`fetch-user guild <id>`)"},
                { name: "fetch-config", value: "Get the list of all configs(`fetch-config all`), specific to guild(`fetch-config guild <id>`)"},
            )
            .setColor("RANDOM");
        message.channel.send(embed);
    }
    if (command === "edit-user-help"){
        const embed = new MessageEmbed()
            .setTitle("Edit User Help")
            .setDescription("Here is the list of available commands! Use `!v edit-user-help` before them")
            .setThumbnail("https://i.imgur.com/4KVqtpu.png")
            .addFields(
                { name: "xp", value: "Edits a user's xp `Args: Number`"},
                { name: "level", value: "Edits a user's level `Args: Number`"},
                { name: "xp-level", value: "Edits a user's xp and level together `Args: Number Number`"},
                { name: "voice-time", value: "Edits a user's voice time in each channel and total voice time `Args: Number Array`\nSeparate elements with spaces"},
            )
            .setColor("RANDOM");
        message.channel.send(embed);
    }
    if (command === "edit-config-help"){
        const embed = new MessageEmbed()
            .setTitle("Edit Config Help")
            .setDescription("Here is the list of available commands! Use `!v edit-config-help` before them")
            .setThumbnail("https://i.imgur.com/4KVqtpu.png")
            .addFields(
                { name: "track-bots", value: "Edits whether bots are able to be tracked `Args: Boolean`"},
                { name: "track-all-channels", value: "Edits whether to track all of the guild's voice channels `Args: Boolean`"},
                { name: "exempt-channels", value: "Filters channels not to be tracked `Args: String`"},
                { name: "channel-ids", value: "The channels to track (if trackAllChannels is true this will be ignored) `Args: Array`\nSeparate elements with spaces"},
                { name: "exempt-permissions", value: "The user permissions to not track `Args: Array`\nSeparate elements with spaces"},
                { name: "exempt-members", value: "The user will not be tracked `Args: String`"},
                { name: "track-mute", value: "Tracks users if they are muted as well `Args: Boolean`"},
                { name: "track-deaf", value: "Tracks users if they are deafened as well `Args: Boolean`"},
                { name: "min-user-count-to-participate", value: "The min amount of users to be in a channel to be tracked `Args: Number`"},
                { name: "max-user-count-to-participate", value: "The max amount of users to be in a channel to be tracked `Args: Number`"},
                { name: "min-xp-to-participate", value: "The min amount of xp needed to be tracked `Args: Number`"},
                { name: "max-xp-to-participate", value: "The max amount of xp needed to be tracked `Args: Number`"},
                { name: "min-level-to-participate", value: "The min level needed to be tracked `Args: Number`"},
                { name: "max-level-to-participate", value: "The max level needed to be tracked `Args: Number`"},
                { name: "xp-amount-to-add", value: "The amount of xp to add to the user `Args: Number`"},
                { name: "voice-time-to-add", value: "The amount of time in ms to add to the user `Args: Number`"},
                { name: "voice-time-tracking-enabled", value:"Whether the voiceTimeTracking module is enabled `Args: Boolean`"},
                { name: "leveling-tracking-enabled", value: "Whether the levelingTracking module is enabled `Args: Boolean`"},
            )
            .setColor("RANDOM");
        message.channel.send(embed);
    }

    if (command === "create-user") {
        message.channel.send("User added to database..");
        client.voiceManager.createUser(message.author.id, message.guild.id, {
            levelingData: {
                xp: 0,
                level: 0
            },
            voiceTime: {
                channels: [],
                total: 0
            }
            // The user will have 0 xp and 0 level.
        });
    }
    if (command === "create-config") {
        message.channel.send("Config added to database..");
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
        message.channel.send("Removed user from database..");
        client.voiceManager.removeUser(message.author.id, message.guild.id); // Removes the user from the database and the cache.
    }
    if (command === "remove-config") {
        message.channel.send("Removed config from database");
        client.voiceManager.removeConfig(message.guild.id); // Removes the config from the database and the cache.
    }
    if (command === "edit-user") {
        switch (args[0]){
            case "xp":
                client.voiceManager.updateUser(message.author.id, message.guild.id, {
                    newLevelingData: {
                        xp: parseInt(`${args[1]}`),
                        level: 0
                    }
                });
                message.channel.send("User xp updated..");
                break;
            case "level":
                client.voiceManager.updateUser(message.author.id, message.guild.id, {
                    newLevelingData: {
                        xp: 0,
                        level: parseInt(`${args[1]}`)
                    }
                });
                message.channel.send("User level updated..");
                break;
            case "xp-level":
                client.voiceManager.updateUser(message.author.id, message.guild.id, {
                    newLevelingData: {
                        xp: parseInt(`${args[1]}`),
                        level: parseInt(`${args[2]}`)
                    }
                });
                message.channel.send("User xp and level updated..");
                break;
            case "voice-time":
                client.voiceManager.updateUser(message.author.id, message.guild.id, {
                    newVoiceTime: {
                        channels: `${args.slice(2)}`,
                        total: parseInt(`${args[1]}`)
                    }
                });
                message.channel.send("User voice time updated..");
                break;
            
            default :
                message.channel.send("Invalid argument.");
                break;
            
        }
    }
    if (command === "edit-config") {
        switch (args[0]){
            case "track-bots":
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackBots: `${args[1]}` === "true"
                });
                message.channel.send("Track bots updated..");
                break;
            case "track-all-channels":
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackAllChannels: `${args[1]}` === "true"
                });
                message.channel.send("Track all channels updated..");
                break;
            case "exempt-channels":
                client.voiceManager.updateConfig(message.guild.id, {
                    newExemptChannels: (channel) => channel.name === `${args[1]}`
                });
                message.channel.send("Exempt channels updated..");
                break;
            case "channel-ids":
                client.voiceManager.updateConfig(message.guild.id, {
                    newChannelIDs: `${args.slice(2)}`
                });
                message.channel.send("Channel ids updated..");
                break;
            case "exempt-permissions":
                client.voiceManager.updateConfig(message.guild.id, {
                    newExemptPermissions: `${args.slice(2)}`
                });
                message.channel.send("Exempt permissions updated..");
                break;
            case "exempt-members":
                client.voiceManager.updateConfig(message.guild.id, {
                    newExemptMembers: (member) => !member.roles.cache.some((r) => r.name === `${args[1]}`)
                });
                message.channel.send("Exempt members updated..");
                break;
            case "track-mute":
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackMute: `${args[1]}` === "true"
                });
                message.channel.send("Track mute updated..");
                break;
            case "track-deaf":
                client.voiceManager.updateConfig(message.guild.id, {
                    newTrackDeaf: `${args[1]}` === "true"
                });
                message.channel.send("Track deaf updated..");
                break;
            case "min-user-count-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMinUserCountToParticipate: parseInt(`${args[1]}`)
                });
                message.channel.send("Min user count to participate updated..");
                break;
            case "max-user-count-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMaxUserCountToParticipate: parseInt(`${args[1]}`)
                });
                message.channel.send("Max user count to participate updated..");
                break;
            case "min-xp-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMinXpToParticipate: parseInt(`${args[1]}`)
                });
                message.channel.send("Min xp to participate updated..");
                break;
            case "min-level-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMinLevelToParticipate: parseInt(`${args[1]}`)
                });
                message.channel.send("Min level to participate updated..");
                break;
            case "max-xp-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMaxXpToParticipate: parseInt(`${args[1]}`)
                });
                message.channel.send("Max xp to participate updated..");
                break;
            case "max-level-to-participate":
                client.voiceManager.updateConfig(message.guild.id, {
                    newMaxLevelToParticipate: parseInt(`${args[1]}`)
                });
                message.channel.send("Max level to participate updated..");
                break;
            case "xp-amount-to-add":
                client.voiceManager.updateConfig(message.guild.id, {
                    newXpAmountToAdd: () => parseInt(`${args[1]}`)
                });
                message.channel.send("Xp amount to add updated..");
                break;
            case "voice-time-to-add":
                client.voiceManager.updateConfig(message.guild.id, {
                    newVoiceTimeToAdd: () => parseInt(`${args[1]}`)
                });
                message.channel.send("Voice time to add updated..");
                break;
            case "voice-time-tracking-enabled":
                client.voiceManager.updateConfig(message.guild.id, {
                    newVoiceTimeTrackingEnabled: `${args[1]}` === "true"
                });
                message.channel.send("Voice time tracking enabled updated..");
                break;
            case "leveling-tracking-enabled":
                client.voiceManager.updateConfig(message.guild.id, {
                    newLevelingTrackingEnabled: `${args[1]}` === "true"
                });
                message.channel.send("Leveling tracking enabled updated..");
                break;
            default: 
                message.channel.send("Invalid argument.");
                break;
        }
    }
    if (command === "fetch-id"){
        switch(args[0]){
            case "user":
                message.guild.members.fetch({ query: `${args[1]}`, limit: 1 })
                .then((u) => { message.channel.send(u.id); })
                .catch(console.error);
                break;
            case "guild":
                message.channel.send(message.guild.id);
                break;
            default:
                message.channel.send("Invalid argument.");
                break;
        }
    }
    if (command === "fetch-user"){
        switch(args[0]){
            case "all":
                message.channel.send(client.voiceManager.users);
                break;
            case "guild":
                message.channel.send(client.voiceManager.users.filter((u) => u.guildId === `${args[1]}`));
                break;
            case "user":
                message.channel.send(client.voiceManager.users.filter((u) => u.userId === `${args[1]}`));
                break;
            default:
                message.channel.send("Invalid argument.");
                break;
        }
    }
    if (command === "fetch-config"){
        switch(args[0]){
            case "all":
                message.channel.send(client.voiceManager.configs);
                break;
            case "guild":
                message.channel.send(client.voiceManager.configs.filter((c) => c.guildId === `${args[1]}`));
                break;
            default:
                message.channel.send("Invalid argument.");
                break;
        }
    }

});

client.login(settings.token);