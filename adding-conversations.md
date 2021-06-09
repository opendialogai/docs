---
description: Conversation in OpenDialog
---

# Conversations

{% hint style="info" %}
Have you read our '[Getting started with OpenDialog](getting-started-1/getting-started-with-opendialog/)' section? If not, we would advise reading that before you dive into the content here as it gives an overview of the concepts behind OpenDialog.
{% endhint %}

Once you get into a [scenario](designer.md) you can start adding new conversations. 

![Scenario Level View](.gitbook/assets/image%20%28179%29.png)

A conversation captures a particular high-level event of your scenario. 

## Conversation Settings

Clicking on the '+' button enables you to add new conversations. The key settings which can be set are behaviours, interpreters, and conditions. 

**Behaviours** are directives to the conversation engine about how to treat the conversation.

**Interpreters** are the components to use to interpret user input. We can define interpreters at every level. Setting the interpreter here means it will act as the default choice for anything under this conversation. 

**Conditions** allow you to check values of attributes within contexts and only if the conditions are met will the conversation be considered as a possible next conversational context for the conversation engine. 

![Adding a new Conversation](.gitbook/assets/image%20%28177%29.png)

Once you've completed the form, click on the tick to save your settings. You will then be returned to the Scenario Level View.

![Conversation called &quot;Another Conversation&quot; added to Scenario](.gitbook/assets/image%20%28178%29.png)

The key decision from a design perspective is what is the core conversation you are going to need to have in your conversational application. For example, the image below shows the conversations for Perfect Fit, our reference demo bot. The use case is that of running shoe recommendations. 

![Conversations in Perfect Fit](.gitbook/assets/image%20%2876%29.png)

Beyond the Welcome and No-Match conversations, there is an Experience conversation \(where we deal with the runner's experience\), a Recommendation conversation \(where we suggest some running shoes\), a Purchase Conversation \(where the sale is completed\). Finally, there is a Feedback conversation \(where we solicit feedback on the experience\) and an End Chat conversation \(where we handle the user requesting to explicitly end the chat\). 

This high-level view captures the core goals quickly. You can now start diving into individual conversations to start shaping the specific functionality. Before we do that though, let's spent just a bit more time on some of the details and settings for Conversations. 

## Conversation Behaviours

Conversations support just one type of _behaviour._ 

### Starting Conversations

A _STARTING_ conversation will only be considered if it is the first time a user interacts with a scenario or when another conversation has been explicitly completed \(conversations can be marked as completed through an intent setting\). 

## Welcome Conversation

The Welcome conversation is the default _STARTING_ conversation. 

It has one Scene and one Turn within that scene which are both _STARTING_ as well. 

Finally, the Welcome Turn, has an intent called `intent.core.welcome` - this is the default intent that OpenDialog WebChat maps to the event of a user first interacting with our Webchat Widget.

{% hint style="warning" %}
While you can, in general, name your intents as you prefer, leaving this one as is will ensure that the Webchat Widget just works with the welcome event. Only rename this intent if you are clear on what the consequences will be.
{% endhint %}

## No Match Conversation

The No Match conversation is the global catch-all conversation the conversation engine will direct the user to when all other attempts to interpret a user message have failed. 

The No Match conversation has a Scene with one turn that holds the`intent.core.NoMatch`intent as the Request intent. The Conversation Engine will generate the`intent.core.NoMatch`intent when all else fails. You can see a more detailed[ description of what actually happens](introduction.md#user-in-ongoing-conversation) here. 

