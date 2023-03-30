const DateTime = require('date-and-time');



const registry = new Map();

registry.set("any", (bot, msg) => msg.text);

registry.set("any_cyrillic", (bot, msg) =>
{
	if(/^[\u0400-\u04FF ]+$/.test(msg.text))
	{
		return msg.text;
	}

	bot.sendMessage(msg.chat.id, "Ввод должен быть на кириллице!");

	return null;
});

registry.set("email", (bot, msg) =>
{
	if(/^\S+@\S+\.\S+$/.test(msg.text))
	{
		return msg.text;
	}

	bot.sendMessage(msg.chat.id, "Неверный почтовый адрес!");

	return null;
});

registry.set("phone", (bot, msg) =>
{
	if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(msg.text))
	{
		return msg.text;
	}

	bot.sendMessage(msg.chat.id, "Неверный номер телефона!");

	return null;
});

registry.set("date", (bot, msg) =>
{
	const date = DateTime.parse(msg.text, "DD.MM.YYYY");

	if(!isNaN(date))
	{
		return date;
	}

	bot.sendMessage(msg.chat.id, "Неверная дата!");

	return null;
});

registry.set("date_range", (bot, msg) =>
{
	const dates = msg.text
		.split("-")
		.map(s => DateTime.parse(s, "DD.MM.YYYY"));

	if(dates.length > 0 && dates.every(d => !isNaN(d)))
	{
		return dates;
	}

	bot.sendMessage(msg.chat.id, "Неверные даты!");

	return null;
});

registry.set("file", (bot, msg) =>
{
	if(msg.document)
	{
		return msg.document.file_id;
	}

	bot.sendMessage(msg.chat.id, "Не прикреплен файл!");

	return null;
});

registry.set("file_pdf", (bot, msg) =>
{
	if (msg.document && msg.document.file_name.endsWith(".pdf"))
	{
		return msg.document.file_id;
	}

	bot.sendMessage(msg.chat.id, "Не прикреплен pdf файл!");
	
	return null;
});



module.exports = registry;