---
description: >-
  Contextual help is customized to the specific part of the interaction where it
  is implemented.
---

# Contextual help

### What it is used for

A user may request help at any time during a conversation. The type of help a user requests depends on where the user is in their journey, the task they are trying to complete, and any options for help they think or perceive to be available.&#x20;

For instance, if a user requests help in a welcome conversation they may be looking for guidance on how to use the assistant and what they can do with the assistant.&#x20;

Further in the conversation, users may want to restart, get help from a customer service agent, or have any other number of questions, that are not covered by a contextual FAQ. There is a fine line as to what should/could be covered by help versus other functions.&#x20;

One can argue that FAQs typically cover subject matter questions, while help covers questions that are not specifically related to the subject matter, and/or that are not covered in typical FAQs.  &#x20;

In certain cases user questions can be handled outside of help. For instance, handover to human can be in its own turn rather than being captured by the help.&#x20;

It is important to understand your users so that you can model your contextual help to cover their needs appropriately.&#x20;

## Pattern Explanation

The goal is to train the NLU for a single help intent that can be reused. For each reuse, the response can be customized to the specific needs of the conversation.&#x20;

While this pattern can be powerful, it may not always be possible to reuse a generic help intent; in certain situations, the user could request help in a contextualized way. E.g. "I need help" is a generic utterance and an intent trained on such generic utterances is reusable. However, "I need help with the instructions field" is contextualized to the specific form the user is filling out and has a question about.&#x20;

Focusing on a reusable pattern, consider the following scene:

![A scene with contextual help](<../../../../../.gitbook/assets/image (81).png>)

This scene gathers profile information from the user. We anticipate that the user may ask for help so we create a help turn that contains utterances such as: "help", "I require assistance", "what am I supposed to do", etc. The response within the Help turn can be highly contextualized since we know that we are in the Gather Profile Info scene.

The Turn Help has two intents:

![](<../../../../../.gitbook/assets/image (84).png>)

The configuration for the "request help" intent from the user looks like this.&#x20;

![Request Help intent settings](<../../../../../.gitbook/assets/image (263).png>)

The response intent from the bot can now provide help relevant to the context.

![Provide help intent settings](<../../../../../.gitbook/assets/image (408).png>)

The NLU interpreter intent and entities to cover help must be set up as well to make this work.&#x20;

&#x20;
