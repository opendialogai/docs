# Example dialog

Transfers commonly happen when a bot is unable to complete a required task, or when a user asks to talk to a human.

`Bot: Unfortunately, I don’t know the details of their menu, but I can call them for you if you’d like to ask directly. Shall I do that?`

`User: Yes please.`&#x20;

`Bot: Sure thing, one second.`&#x20;

**`Transfer`**

`[Phone rings at Bella Italia, human-human conversation clarifying the user’s question, then the call ends, bot picks up]`

`Bot: Were they able to help you?`

`User: Yes, thank you.`&#x20;

**`Closing (Pre-Closing)`**

`Bot: Is there anything else I can help you with?`

In this sequence, the user asks the bot a question the bot recognizes well enough to know it doesn’t know the answer and that a transfer to the restaurant may be the appropriate next step. The handoff trigger is a question the bot cannot handle on its own. The bot offers to call the restaurant for the user, which the user accepts.

In this sequence, the bot is put on hold while the user has a traditional phone conversation with the restaurant. When the call is complete, the bot takes over again and asks if the user’s need was met. After the user says it was, the bot moves on to the next step of the conversation, in this case a last topic check as part of a pre-closing.
