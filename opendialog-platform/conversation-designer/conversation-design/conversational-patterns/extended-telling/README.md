# Extended telling

Extended tellings are for contexts where you need to communicate a lot of content and the bot holds the floor for an extended period of time. Common types of extended tellings include trainings, education modules, stories and quotations, all times where a bot may need to hold the floor for longer than a single turn.

Structurally, extended tellings are conversational sequences with an opening (e.g. “tell me about Paris”), a body, and a closing. A training pattern’s body involves the teller 1) giving the first part of the telling and 2) waiting for a listener cue to continue. These continuation cues may be simple tokens like “uh-huh”, “okay”, “yeah” or gestures like a head nod. The pause for a continuation cue allows the listener to initiate repair if needed, or interrupt or redirect the conversation if desired (taking the floor).

The training can be sped up if the bot doesn’t wait for continuation cues, though the user should still be afforded a way to initiate repair (e.g. a UI element to exit the telling). Doing an extended telling without any listener option to provide continuation cues or initiate repair can feel like railroading to a user, being forced to cede the floor unwillingly. This can show up when a chatbot presents many text bubbles all at once, flooding the chat UI.

To be clear that you intend to hold the floor, reduce cues to turn transition at utterance end (but you can add those cues inside utterances when it’s unambiguously not a turn transition). In addition, at utterance end make sure not to pause too long, to start again quickly, speak louder, don’t use falling intonation, use high onset pitch.
