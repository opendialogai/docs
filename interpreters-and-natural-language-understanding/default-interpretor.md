# Default Interpreter

## Default Interpreter

The default interpreter that comes out of the box with OpenDialog is useful primarily for **button-driven conversations** and **prototyping**.&#x20;

### Button-driven (or guided) conversations

When we build a message with a button we can instruct the button to send the name of a specific intent to the OpenDialog conversation engine. Within the[ message markup](../developing-with-opendialog/message-markup.md) this intent is defined within `callback` tag.&#x20;

When the user clicks a button the WebChat widget will send to the conversation engine an event that contains the value within the callback tag. The conversation engine will then attempt to match that callback to the value of a specific intent within your scenario (based on the overall conversational state).&#x20;

This enables us to build very flexible button-driven conversations where we don't have to change our mental model of how a conversation works. A button click is just an utterance that needs to be mapped to an intent like a natural language utterance. The only difference is that there is no ambiguity as to what the user just said. &#x20;

The default callback interpreter is essential for button-driven interaction and can help with simple prototyping, but for actual NLU we need to use an [NLU interpreter which we discuss here](dialogflow-interpreter/).&#x20;

{% hint style="success" %}
**Tutorial:** Want to create your own button-driven conversation like the example below? Jump over to our tutorial section and follow the [step-by-step guide for a button-driven conversation](../tutorials/building-a-simple-button-driven-conversational-application/).&#x20;
{% endhint %}

{% embed url="https://youtu.be/GAY5vlIPiOA" %}
Tutorial: Button driven bot
{% endembed %}

