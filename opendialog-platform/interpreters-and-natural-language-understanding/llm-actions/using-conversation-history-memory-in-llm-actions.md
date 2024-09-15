# Using conversation history (memory) in LLM actions

One of the most powerful aspects of LLM actions is that you can customise your prompts to take into account specific aspects of the conversation. One of this aspects is the actual conversation history. We provide a dedicated OpenDialog context - called `history` that you can use to access conversation history in a number of different ways.&#x20;

There are three different ways to access information in the `history` context

### Transcript

`{history.transcript}`

Transcript provides a single string that is a transcript of the entire conversation to the point that it is called. This is the simplest way to add the entire conversation history to a prompt.&#x20;

### Utterances

`{history.utterances}`

This is similar to transcript but the attribute is shaped as a collection of strings which means we can apply filters to it to become a bit more specific about how much and what part of the conversation we want to access.&#x20;

#### Limit number of utterances

For example the following&#x20;

`{history.utterances | last 3}` will add to our prompt just the last 3 utterances said making it possible to focus on just a relevant part of the conversation.&#x20;

`{history.utterances | where participant user}` will give us just the user utterances while `{history.utterances | where participant app}` will give us just the application utterances.

`{history.utterances | where participant user | last 3}` will limit information to just the last 3 things the user said, ignoring application utterances.&#x20;

Conversely, something like&#x20;

`{history.utterances | where participant app | last 3}` will limit information to just the last 3 things the application said, ignoring any user utterances.

### Intents

While utterances represent exactly what the user or the application said, and may contain information that is not strictly required for the reasoning of a specific prompt the `intents` attribute gives us access to just the intents as defined in conversation design. This can be particularly useful when looking to understand the broad context of an exchange but not the specific of what either the user or the application said.&#x20;

Similarly to history above you can access it via

`{history.intents}` and can apply the same filters on participants and number of intents.&#x20;

{% hint style="warning" %}
Currently, the curly brackets attribute autocomplete UI element in LLM actions does not handle context anmes and assumes the user context. To type something like `{history.intents}` start by typing intents (to take advantage of the autocomplete search) and then add the context manually. Alternatively you can simply copy and paste the examples from here and adjust!&#x20;
{% endhint %}

