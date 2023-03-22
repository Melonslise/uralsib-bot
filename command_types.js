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

});



module.exports = registry;