# Components

### Triggers for an extended telling

* User questions
  * How does one meditate?
  * How do I do that?
* User requests
  * Tell me a story
  * Tell me all the things you can do
  * Tell me about your vacation
* Bot proposals
  * Would you like to hear some healthy sleep tips?

### Extended telling sequence

* Bot gives the first part of the telling
  * Good message design here will reduce cues to turn transition at utterance end (lots of intonational cues, avoid sequence-ending moves e.g. gratitude, summation, etc…), making it clear bot plans to continue. \

* User provides cues to the next step (skipping the option for these user cues can speed things up but also feel like railroading to the user; it can also overwhelm e.g with a ton of chat bubbles from the bot all at once).
  * Cued to continue (“hm mm”, “yeah”, “go on”, “continue”) → loop with more tellings. Note: if the user does nothing during bot pausing for cue, normally this is taken as cue to continue.
  * Cued to stop the telling (“I’m bored”, “can we do something else?”) → exit
  * Cued for repair → trigger repair (see example below)
* Aborting the story

`A: Tell me a story`

`B: Once upon a time, there was…`

`A: {{pause}}`

`B: And then the hero…`

`A: This is boring`

`B: Shall I stop?`

`A: Yes`

`B: Okay`

### Closing cues for an extended telling

* Ask for questions: “Do you have any questions about what I just shared?”
* Summation: “And that’s a short introduction to how square-breathing works.”
* Gratitude: “Thank you for your attention.”
* Well-wishing: “I hope things improve for you soon.”
* Offer to repeat: “Would you like to hear this again?”
* Restatement of the reason for the extended telling (“And that’s a practice that you can use anytime you’re feeling stressed.”).

## Examples

* Training: a walkthrough or how-to, e.g. for how to meditate&#x20;
* Education: deeper content sharing, e.g. guidance for how to get healthy sleep&#x20;
* Story, e.g. giving the origin story of the bot&#x20;
* Quotation, e.g. reciting a lengthy poem or quotation
