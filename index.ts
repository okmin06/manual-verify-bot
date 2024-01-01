import Discord, { Client } from "discord.js";
import config from "./config.json";

export const client = new Client({
    intents: ['Guilds']
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('guildCreate', async guild => {
    
})

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true
            });
            return;
        }

    if (interaction.commandName === 'invite') {
        interaction.channel!.send({
            embeds: [
                new Discord.EmbedBuilder({
                    title: '입장권한 신청',
                    description: '입장 목적을 적어주시면 검토후 승인해드리겠습니다',
                    color: 0x009BE3,
                })
            ],
            components: [
                new Discord.ActionRowBuilder<Discord.ButtonBuilder>({
                    components:[
                        new Discord.ButtonBuilder({
                            customId: JSON.stringify({
                                type: 'verify'
                            }),
                            label: '요청하기',
                            style: Discord.ButtonStyle.Primary
                        })
                    ]
                })
            ]
        })}
        interaction.reply({
            content: 'sent',
            ephemeral: true
        })
    } else if (interaction.isModalSubmit()){
        const channel = client.channels.cache.get(config.channelId) // 요청이 들어올 채널 승인/거부가 이루어질 채널
        const nickname = interaction.fields.fields.get('invite')?.value;
        const dm = interaction.guild?.members.fetch(config.owner) // 디스코드 id 를 통해 유저 정보를 가져옴

        if(channel && channel.isTextBased()){
            channel.send({
                embeds: [
                    new Discord.EmbedBuilder({
                        title: `가입승인신청`,
                        color: 0x0099FF,
                        description: `
                        가입사유: ${nickname}
                        디스코드: ${interaction.user.tag}
                        `,
                        footer: ({text: `DiscordID: ${interaction.user.id}`}),
                        timestamp: new Date().toISOString(),
                    })
                ],
                components: [
                    new Discord.ActionRowBuilder<Discord.ButtonBuilder>({
                        components:[
                            new Discord.ButtonBuilder({
                                customId: JSON.stringify({
                                    type: 'ok'
                                }),
                                label: '승인',
                                style: Discord.ButtonStyle.Success
                            }),
                              new Discord.ButtonBuilder({
                                customId: JSON.stringify({
                                    type: 'denied'
                                }),
                                label: '거부',
                                style: Discord.ButtonStyle.Danger
                            })
                        ]
                    })
                ]
            })
        }
            interaction.reply({
            content: '관리자에게 정보가 전송이 완료 되었습니다. 승인이 될때까지 기다려주세요.',
            ephemeral: true
        })
        // dm?.then((user) => {
        //     user.send({
        //         content: `backup 서버 권한 신청이 들어왔습니다. 확인해주세요. ${channel}`
        //     })
        // })
    } else if (interaction.isButton()) {
        const data = JSON.parse(interaction.customId);

        if(data.type === "verify"){
            await interaction.showModal(new Discord.ModalBuilder({
                title: '인증하기',
                customId: JSON.stringify({
                    type: 'verify'
                }),
                components: [
                    new Discord.ActionRowBuilder<Discord.TextInputBuilder>({
                        components:[
                            new Discord.TextInputBuilder({
                                label: '입장사유',
                                minLength: 1,
                                maxLength: 36,
                                customId: 'invite',
                                placeholder: 'ex) 구경치면 빠꾸',
                                style: Discord.TextInputStyle.Short
                            })
                        ]
                    })
                ]
            }));
        } else if (data.type === "ok"){
            const requestUser = interaction.message.embeds[0].footer?.text?.split(' ')[1]; // emded의 footer에서 discordid를 가져옴
            const waiting = await interaction.guild?.members.fetch(requestUser!); // 위에 가져온 discordid를 통해 유저를 가져옴
            const role = interaction.guild?.roles.cache.find(role => role.name === `${config.roleName}`); // 승인시 부여할 역할
    
            await waiting?.roles.add(role!);

            await interaction.message.edit({
                embeds: [
                    new Discord.EmbedBuilder({
                            title: 'Access Granted',
                            description: `Granted by ${interaction.user.tag}`,
                            footer: ({text: `Approved User: ${waiting?.user.tag}`}),
                            timestamp: new Date().toISOString(),
                            color: 0x3CFF03
                    })
                ], components: []
            })
            
        } else if (data.type === "denied"){
            const requestUser = interaction.message.embeds[0].footer?.text?.split(' ')[1]; // emded의 footer에서 discordid를 가져옴
            const waiting = await interaction.guild?.members.fetch(requestUser!); // 위에 가져온 discordid를 통해 유저를 가져옴

            await interaction.message.edit({
                embeds: [
                    new Discord.EmbedBuilder({
                            title: 'Access Denied',
                            description: `Denied by ${interaction.user.tag}`,
                            footer: ({text: `Denied User: ${waiting?.user.tag}`}),
                            timestamp: new Date().toISOString(),
                            color: 0xFF0303
                    })
                ], components: []
            })
        }
    }
     // interaction.user.send('관리자에게 정보가 전송이 완료 되었습니다. 승인이 될때까지 기다려주세요.')
})

client.login(config.token);
