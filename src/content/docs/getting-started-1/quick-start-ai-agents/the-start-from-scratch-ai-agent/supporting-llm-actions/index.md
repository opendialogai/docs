---
title: Supporting LLM Actions
description: The LLM Actions used by the "Start from Scratch" scenario
---

To support fluid conversation exchange the "Start from Scratch" scenario uses a number of LLM Actions that can form a solid basis / template for your own LLM Actions.

![](</.gitbook/assets/Screenshot 2024-11-09 at 18.43.42.png>)

*LLM Actions of the "Start from Scratch" scenario*

## No Match Response Generation

This action is attached to the `NoMatchResponse` APP intent in the Global No Match conversation and provides an appropriate response to explain to the user that we were not able to classify and hence respond to their phrase.

Crucially, since we were not able to classify the user phrase we do not send it to the underlying LLM to provide a further level of safety.

## Agent Capability Response

The Agent Capability response action is attached to the `AboutTheBotResposne` APP intent and generates an answer to questions around what the bot can do.

## Topic Generation Response

The Topic Generation Response action is the most often used on and it is attached to all the intents that are broad topics (which would be using a specific knowledge source).

:::note
Please make sure to update this action with any specific topic sources you want to use.
:::

## Statement Responses

This LLM Action generates a context response to statements based on whether the statements are relevant or not to the topic of the conversation.

## Feedback Responses

Similarly to Statement Responses this LLM action generates Feedback responses based on the type of feedback and whether it was positive or negative.

## Customise welcome message

By default the welcome message is static - but you can use this LLM action as your starting point to create dynamic welcome messages that take into account topic and user attributes.

## Casual Conversation Response

Finally the Casual Conversation Response action generates an appropriate response to casual conversation statements such as greetings, simpler jokes and other small talk.
