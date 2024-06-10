# Components

Closings are composed of pre-closing material and a final closing pair.

### Common pre-closings

Pre-closings are social actions that commonly bridge between the body of a conversation and the final closing pair. These often include:

* Last topic check
* Well-wishing (“Have a good day!”, “Enjoy your vacation!”)
* Acknowledgments about the relationship or activity (“It’s been a pleasure chatting with you”)
* Mentions of future activities together (“I’ll see you tomorrow!”)
* Restatement of the reason for the conversation (“Yeah I just called to make sure you’re doing well.”)
* A common saying, proverb, or aphorism (“Yeah well, things always work out for the best.”)

### Closing pair

* Bye - Bye
  * synonyms for “bye” can be swapped, e.g. goodbye, see ya, later, ciao, cheers, or whatever works in your context.

The last topic check can be used for a single part of the conversation, or for the conversation as a whole. This is an approach taken by one of DialogflowCX’s templates, a Financial Services bot. Within a discussion of card features, the section closes by asking “Would you like to compare any more card features?” This is a last topic check on the card features portion of the interaction. Once this is closed, the bot moves up to the level of the whole conversation, asking “Is there anything else I can help you with?” If declined, this last topic check then moves on to the pre-closing part of the conversation.

Alexa’s version of templates are called skill blueprints. The format for the “Business Q\&A” skill is a series of questions, a last question check, and then a goodbye. This template includes none of the pre-closing social actions listed above. Interestingly, the Amazon doc doesn’t transcribe the closing even though it is part of the audio recording, suggesting it is an afterthought.
