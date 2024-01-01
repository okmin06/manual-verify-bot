const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: "invite",
        description: "invite",
    }
];

const rest = new REST({ version: '10' }).setToken("");//bot token

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands("", ""),//client_id, guild_id
            { body: commands },
        ) 
            console.log('Successfully reloaded application (/) commands.');
        }catch (error) {
        console.error(error);
    };
})();

// export default commands;
