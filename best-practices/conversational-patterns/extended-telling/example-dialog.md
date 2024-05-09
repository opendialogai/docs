# Example dialog

During a conversation, there may be an opportunity for the bot to talk for an extended period. In this example for a hospitality use case, the bot offers to give background on the hotel.&#x20;

`Bot: Hotel OpenDialog was first opened in 1908. Would you like to hear more about its history?`

`User: Yeah!`

**`Extended Telling`**

`Bot: Hotel OpenDialog was first established by the Smith family in 1908 as a comfortable space for travelers to rest and relax while they explored the downtown area. Since the construction of the ballroom in 1965, we’ve been hosting weddings as well.`

`[pause]`

`Bot: Hotel OpenDialog has three locations, one downtown, one near the airport, and one at Pier 37 on the waterfront. The hotels at all three locations were sold to the Marriott company in 2002, and have been operated by Marriot since then.`&#x20;

`User: Cool, that’s enough.`&#x20;

First, the bot shares a piece of information, and then asks if the user would like more. When the user says yes, this launches an extended telling sequence wherein the bot educates the user about the history of the hotel. After two long sentences of the content, the bot pauses briefly for the user to give a cue to continue or steer in a different direction. The user not saying anything is taken interpreted by the bot as a cue to continue, which the bot does by talking about different locations and the acquisition of the company by Marriott. When the bot pauses again, the user indicates that the bot can stop. This closes the extended telling sequence, moving on to the next part of the conversation.
