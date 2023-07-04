import mongoose from "mongoose";


const Schema = mongoose.Schema;

const chat = new Schema({
    chatID: String,
    title: String,
    messages: Array,
    createTime: Date,
    updateTime: Date
});
export const schema_chat = mongoose.model("chat", chat, "chats");

const guild = new Schema({
    guildID: String,
    chatChannelID: String
});
export const schema_guild = mongoose.model("guild", guild, "guilds");