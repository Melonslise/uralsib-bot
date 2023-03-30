/* ============= Imports ============= */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const CommandTypes = require("./command_types");
const Commands = require("./content/commands.json");


/* ============= Bot setup ============= */

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

console.log("Bot started");



bot._sessions = new Map();

bot.getSessionLazy = function(chatId)
{
	let session = this._sessions.get(chatId);

	if(!session)
	{
		session = { id: chatId };
		this._sessions.set(chatId, session);
	}

	return session;
}



/* ============= Commands and form prompts ============= */

function execCmdByIdx(chatId, cmdIdx)
{
	if(cmdIdx < 0 || cmdIdx >= Commands.length)
	{
		bot.sendMessage(chatId, "Неизвестная команда");

		return;
	}

	const cmdInfo = Commands[cmdIdx];

	CommandTypes.exec(bot, chatId, cmdInfo);
}

function execCmdByName(chatId, text)
{
	if (!text)
	{
		bot.sendMessage(chatId, "На данный момент бот поддерживает только текстовые команды");

		return
	}

	const cmdIdx = Commands.findIndex(e => e.cmd === text.toLowerCase());

	execCmdByIdx(chatId, cmdIdx);
}



/* ============= Message handling ============= */

bot.on("message", msg =>
{
	const chatId = msg.from.id;

	const form = bot.getSessionLazy(chatId).form;

	if(form && form.isActive())
	{
		form.answer(msg);
	}
	else
	{
		execCmdByName(chatId, msg.text);
	}
});

bot.on("callback_query", query =>
{
	const chatId = query.from.id;

	const form = bot.getSessionLazy(chatId).form;

	// don't trigger buttons if currently filling form
	if(!form || !form.isActive())
	{
		execCmdByIdx(chatId, +query.data);
	}
});

bot.on("polling_error", console.log);