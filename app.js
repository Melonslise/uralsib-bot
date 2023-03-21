require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Commands = require("./content/commands.json");



const bot = new TelegramBot(process.env.TOKEN, { polling: true });

console.log("Bot started");

bot.on("message", msg =>
{
	const fromId = msg.from.id;

	if (!msg.text)
	{
		bot.sendMessage(fromId, "На данный момент бот поддерживает только текстовые команды");

		return
	}

	const cmdInfo = Commands[msg.text.toLowerCase()];

	if(!!cmdInfo)
	{
		if(cmdInfo.type === "text")
		{
			bot.sendMessage(fromId, cmdInfo.arg, { reply_markup: { keyboard: cmdInfo.keyboard, one_time_keyboard: true } });
		}

		return;
	}

	bot.sendMessage(fromId, "Неизвестная команда");
});
