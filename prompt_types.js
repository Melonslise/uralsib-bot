const registry = new Map();

registry.set("any", (bot, chatId, input) => true);

registry.set("email", (bot, chatId, input) =>
{
	if(/^\S+@\S+\.\S+$/.test(input))
	{
		return true;
	}

	bot.sendMessage(chatId, "Неверный почтовый адрес!");

	return false;
});

registry.set("phone", (bot, chatId, input) =>
{
	if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(input))
	{
		return true;
	}

	bot.sendMessage(chatId, "Неверный номер телефона!");

	return false;
});



module.exports = registry;