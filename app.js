require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Commands = require("./content/commands.json");



const bot = new TelegramBot(process.env.TOKEN, { polling: true });

console.log("Bot started");



function execCmdByIdx(fromId, cmdIdx)
{
	if(cmdIdx < 0)
	{
		bot.sendMessage(fromId, "Неизвестная команда");

		return;
	}

	const cmdInfo = Commands[cmdIdx];

	if(cmdInfo.type === "text")
	{
		bot.sendMessage(fromId, cmdInfo.arg, { reply_markup: { inline_keyboard: cmdInfo.keyboard.map(e => e.map(t => ({ text: t, callback_data: Commands.findIndex(c => c.cmd === t.toLowerCase()) }))) } });
	}
}

function execCmd(fromId, text)
{
	if (!text)
	{
		bot.sendMessage(fromId, "На данный момент бот поддерживает только текстовые команды");

		return
	}

	const cmdIdx = Commands.findIndex(e => e.cmd === text.toLowerCase());

	execCmdByIdx(fromId, cmdIdx);
}



bot.on("message", msg =>
{
	execCmd(msg.from.id, msg.text);
});

bot.on("callback_query", query =>
{
	execCmdByIdx(query.from.id, +query.data);
});

bot.on("polling_error", console.log);