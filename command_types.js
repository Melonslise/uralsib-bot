const Form = require("./form");



const registry = new Map();

registry.exec = function(bot, chatId, cmdInfo)
{
	// TODO: handle invalid type
	this.get(cmdInfo.type) (bot, chatId, cmdInfo);
}

registry.set("text", (bot, chadId, cmdInfo) =>
{
	bot.sendMessage(chadId, cmdInfo.arg, { reply_markup: { inline_keyboard: cmdInfo.keyboard } });
});

registry.set("form", (bot, chatId, cmdInfo) =>
{
	const form = bot.getSessionLazy(chatId).form = new Form(bot, chatId, cmdInfo.arg);
	form.prompt(bot, chatId);
});



module.exports = registry;