const PromptTypes = require("./prompt_types");



module.exports = class form
{
	constructor(bot, chatId, prompts)
	{
		this.bot = bot;
		this.chatId = chatId;

		this.prompts = prompts.concat(); // copy
		this.answers = [];
	}

	isActive()
	{
		return this.prompts.length > 0;
	}

	prompt()
	{
		const promptInfo = this.prompts[0];

		if(promptInfo)
		{
			this.bot.sendMessage(this.chatId, promptInfo.prompt);
		}
	}

	answer(input)
	{
		const promptInfo = this.prompts[0];
	
		if(!promptInfo)
		{
			return;
		}
	
		const condition = PromptTypes.get(promptInfo.type);
	
		if(condition(input))
		{
			this.prompts.shift();
			this.answers.push(input);

			if(this.isActive())
			{
				this.prompt();
			}
			else
			{
				this._finish();
			}
		}
	}

	_finish()
	{
		console.log(this.answers);

		// TODO: custom msg
		this.bot.sendMessage(this.chatId, "Заявка отправлена!")
	}
}