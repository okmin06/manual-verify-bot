const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: "invite",
        description: "invite",
    }
];

const rest = new REST({ version: '10' }).setToken("MTE4NjIzNzEzMDQ4MjEyMjc5Mg.GIXxHw.1K_k4Y7Rz2llsdwQAZr36U3jYtQSTqfjlnGZXY");//bot token

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands("1186237130482122792", "1186174856908247081"),//client_id, guild_id
            { body: commands },
        ) 
            console.log('Successfully reloaded application (/) commands.');
        }catch (error) {
        console.error(error);
    };
})();

// export default commands;