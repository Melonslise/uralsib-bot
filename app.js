require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const CommandTypes = require("./command_types");
const Commands = require("./content/commands.json");



const bot = new TelegramBot(process.env.TOKEN, { polling: true });

console.log("Bot started");



function execCmdByIdx(fromId, cmdIdx)
{
	if(cmdIdx < 0 || cmdIdx >= Commands.length)
	{
		bot.sendMessage(fromId, "Неизвестная команда");

		return;
	}

	const cmdInfo = Commands[cmdIdx];

	CommandTypes.exec(bot, fromId, cmdInfo);
}

function execCmdByName(fromId, text)
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
	execCmdByName(msg.from.id, msg.text);
});

bot.on("callback_query", query =>
{
	execCmdByIdx(query.from.id, +query.data);
});

bot.on("polling_error", console.log);