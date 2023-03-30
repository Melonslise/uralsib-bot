const PromptTypes = require("./prompt_types");



module.exports = class Form
{
	constructor(bot, formInfo)
	{
		this.bot = bot;

		this.prompts = formInfo.prompts.concat(); // copy
		this.answers = [];

		this.response = formInfo.response;
	}

	isActive()
	{
		return this.prompts.length > 0;
	}

	prompt(chatId)
	{
		const promptInfo = this.prompts[0];

		if(promptInfo)
		{
			this.bot.sendMessage(chatId, promptInfo.prompt);
		}
	}

	async answer(msg)
	{
		const promptInfo = this.prompts[0];
	
		if(!promptInfo)
		{
			return;
		}
	
		const validator = PromptTypes.get(promptInfo.type);
	
		const parsedInput = validator(this.bot, msg);

		if(!parsedInput)
		{
			this.prompt(msg.chat.id);

			return;
		}

		this.prompts.shift();
		this.answers.push(parsedInput);

		await this.bot.sendMessage(msg.chat.id, promptInfo.confirm);

		if(this.isActive())
		{
			this.prompt(msg.chat.id);
		}
		else
		{
			this._finish(msg.chat.id);
		}
	}

	_finish(chatId)
	{
		console.log(this.answers);

		this.bot.sendMessage(chatId, this.response)
	}
}