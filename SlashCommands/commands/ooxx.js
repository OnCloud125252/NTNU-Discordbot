import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";


function getResult(phase, gameBoard, user) {
    let embed;
    if (phase == 4) {
        embed = new EmbedBuilder().setTitle("遊戲結束").setDescription("兩人平手");
    } else {
        embed = new EmbedBuilder()
            .setTitle("遊戲結束")
            .setDescription(`玩家 <@${user[(phase - 1) % 2].id}>勝利`);
    }
    let components = new Array(3);
    for (let i = 0; i < 3; i++) {
        let row;
        let buttons = new Array(3);
        for (let j = 0; j < 3; j++) {
            const number = i * 3 + j;
            let button;

            if (gameBoard[number] == 0) {
                button = new ButtonBuilder()
                    .setEmoji("⭕")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${number}`)
                    .setDisabled(true);
            } else if (gameBoard[number] == 1) {
                button = new ButtonBuilder()
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${number}`)
                    .setDisabled(true);
            } else {
                button = new ButtonBuilder()
                    .setEmoji("❓")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`${number}`)
                    .setDisabled(true);
            }
            buttons[j] = button;
        }
        row = new ActionRowBuilder().addComponents(buttons);
        components[i] = row;
    }

    return { embeds: [embed], components: components };
}

function checkGame(gameBoard) {
    let phase = 1;

    if (gameBoard[0] == gameBoard[1] && gameBoard[1] == gameBoard[2] && gameBoard[0] != undefined) {
        phase = 2 + gameBoard[0];
    } else if (
        gameBoard[3] == gameBoard[4] &&
        gameBoard[4] == gameBoard[5] &&
        gameBoard[3] != undefined
    ) {
        phase = 2 + gameBoard[3];
    } else if (
        gameBoard[6] == gameBoard[7] &&
        gameBoard[7] == gameBoard[8] &&
        gameBoard[6] != undefined
    ) {
        phase = 2 + gameBoard[6];
    } else if (
        gameBoard[0] == gameBoard[4] &&
        gameBoard[4] == gameBoard[8] &&
        gameBoard[4] != undefined
    ) {
        phase = 2 + gameBoard[4];
    } else if (
        gameBoard[0] == gameBoard[3] &&
        gameBoard[3] == gameBoard[6] &&
        gameBoard[3] != undefined
    ) {
        phase = 2 + gameBoard[3];
    } else if (
        gameBoard[1] == gameBoard[4] &&
        gameBoard[4] == gameBoard[7] &&
        gameBoard[1] != undefined
    ) {
        phase = 2 + gameBoard[4];
    } else if (
        gameBoard[2] == gameBoard[5] &&
        gameBoard[5] == gameBoard[8] &&
        gameBoard[2] != undefined
    ) {
        phase = 2 + gameBoard[2];
    } else if (
        gameBoard[2] == gameBoard[4] &&
        gameBoard[4] == gameBoard[6] &&
        gameBoard[4] != undefined
    ) {
        phase = 2 + gameBoard[2];
    }

    if (phase == 1) {
        phase = 4;
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] == undefined) {
                phase = 1;
                break;
            }
        }
    }

    return phase;
}

function runGame(buttonId, round, gameBoard, user) {
    const embed = new EmbedBuilder()
        .setTitle("開始遊戲")
        .setDescription(`現在是玩家 <@${user[round % 2].id}> 的回合`);
    let components = new Array(3);
    for (let i = 0; i < 3; i++) {
        let row;
        let buttons = new Array(3);
        gameBoard[buttonId] = round % 2;
        for (let j = 0; j < 3; j++) {
            const number = i * 3 + j;
            let button;

            if (gameBoard[number] == 0) {
                button = new ButtonBuilder()
                    .setEmoji("⭕")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${number}`)
                    .setDisabled(true);
            } else if (gameBoard[number] == 1) {
                button = new ButtonBuilder()
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`${number}`)
                    .setDisabled(true);
            } else {
                button = new ButtonBuilder()
                    .setEmoji("❓")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`${number}`);
            }
            buttons[j] = button;
        }
        row = new ActionRowBuilder().addComponents(buttons);
        components[i] = row;
    }
    return { embeds: [embed], components: components };
}

function setGame(gameBoard, user) {
    const embed = new EmbedBuilder()
        .setTitle("開始遊戲")
        .setDescription(`現在是玩家 <@${user[0].id}> 的回合`);

    for (let i = 0; i < 9; i++) {
        gameBoard[i] = undefined;
    }

    let components = new Array(3);
    for (let i = 0; i < 3; i++) {
        let row;
        let buttons = new Array(3);
        for (let j = 0; j < 3; j++) {
            const number = i * 3 + j;
            const button = new ButtonBuilder()
                .setEmoji("❓")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`${number}`);

            buttons[j] = button;
        }
        row = new ActionRowBuilder().addComponents(buttons);
        components[i] = row;
    }
    return { embeds: [embed], components: components };
}

function startGame(user1, user2) {
    let embed;

    const yesButton = new ButtonBuilder()
        .setEmoji("⭕")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("yes");

    const noButton = new ButtonBuilder()
        .setEmoji("❌")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("no");

    const cancelButton = new ButtonBuilder()
        .setLabel("取消對決")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("cancel");

    const row = new ActionRowBuilder().addComponents(noButton, yesButton, cancelButton);

    embed = new EmbedBuilder()
        .setTitle("來玩OOXX")
        .setDescription(`玩家 <@${user1.id}> 向 <@${user2.id}> 發送了挑戰，正在等待回應，請稍後`);

    return { embeds: [embed], components: [row] };
}

function sendRefuse() {
    const embed = new EmbedBuilder()
        .setTitle("被拒絕了")
        .setDescription("你的邀請沒有被該玩家回應或是被拒絕");
    const yesButton = new ButtonBuilder()
        .setEmoji("⭕")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("yes")
        .setDisabled(true);
    const noButton = new ButtonBuilder()
        .setEmoji("❌")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("no")
        .setDisabled(true);
    const row = new ActionRowBuilder().addComponents(noButton, yesButton);
    return { embeds: [embed], components: [row] };
}

export default {
    data: new SlashCommandBuilder()
        .setName("ooxx")
        .setDescription("找個人來玩OOXX吧")
        .addUserOption((option) =>
            option.setName("另一個玩家").setDescription("邀請一個人來玩吧").setRequired(true),
        ),
    async execute(client, interaction) {
        const user1 = interaction.user;
        const user2 = interaction.options.getUser("另一個玩家");
        let gameBoard = new Array(9);
        let count = 0;
        let user = [user1, user2];

        const collector = interaction.channel.createMessageComponentCollector({ time: 150000 });
        let reply = startGame(user1, user2);
        await interaction.reply(reply);
        let phase = 0; // 開始為0 直接結束為-1 運行為1 玩家一勝利為2 玩家二勝利為3 平手為4

        collector.on("collect", (collected) => {
            // console.log(collected.customId);

            if (![user1.id, user2.id].includes(collected.user.id)) {
                const embed = new EmbedBuilder()
                    .setTitle("錯誤")
                    .setDescription("沒事按這顆按鈕幹嘛");
                collected.reply({ embeds: [embed], ephemeral: true });
                phase = 0;
            }
            else if (collected.customId !== "cancel" && !["0", "1", "2", "3", "4", "5", "6", "7", "8"].includes(collected.customId) && user1.id !== user2.id && collected.user.id === user1.id) {
                const embed = new EmbedBuilder()
                    .setTitle("錯誤")
                    .setDescription("不要強迫別人參戰歐");
                collected.reply({ embeds: [embed], ephemeral: true });
                phase = 0;
            }
            else {
                switch (collected.customId) {
                    case "yes": {
                        if (collected.user.id === user2.id) {
                            reply = setGame(gameBoard, user);
                            collected.update(reply);
                            phase = 1;
                        }
                        break;
                    }

                    case "no": {
                        if (collected.user == user2) {
                            reply = sendRefuse();
                            collected.update(reply);
                            phase = -1;
                        }
                        break;
                    }

                    case "cancel": {
                        const embed = new EmbedBuilder()
                            .setTitle("對決取消")
                            .setDescription("遊戲已取消");
                        const yesButton = new ButtonBuilder()
                            .setEmoji("⭕")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("yes")
                            .setDisabled(true);
                        const noButton = new ButtonBuilder()
                            .setEmoji("❌")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("no")
                            .setDisabled(true);
                        const row = new ActionRowBuilder().addComponents(noButton, yesButton);
                        reply = { embeds: [embed], components: [row] };
                        collected.update(reply);
                        collector.stop();
                        break;
                    }

                    default: {
                        if (collected.user.id == user[count % 2].id) {
                            count++;
                            // console.log("same");
                            reply = runGame(collected.customId, count, gameBoard, user);
                            phase = checkGame(gameBoard);
                            if (phase != 1) {
                                reply = getResult(phase, gameBoard, user);
                            }
                            collected.update(reply);
                            // console.log(`phase = ${phase}`);
                        } else if (collected.user.id == user[(count + 1) % 2].id) {
                            const embed = new EmbedBuilder()
                                .setTitle("錯誤")
                                .setDescription("你需要等對方移動完");
                            collected.reply({ embeds: [embed], ephemeral: true });
                        } else {
                            const embed = new EmbedBuilder()
                                .setTitle("錯誤")
                                .setDescription("按這顆按鈕幹嘛");
                            collected.reply({ embeds: [embed], ephemeral: true });
                        }
                        break;
                    }
                }

                if (phase > 1 && phase < 5) {
                    collector.stop();
                } else if (phase != 1) {
                    collector.stop();
                }
            }
        });
        if (phase != 0 || phase != 1) {
            return;
        }
    },
};