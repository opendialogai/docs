---
description: >-
  Use OpenDialog Interpreter Orchestration to set a highest priority interpreter
  at different levels of your conversation.
---

# Interpreter Orchestration

<figure><img src="../../.gitbook/assets/Screenshot 2024-03-27 at 08.40.11.png" alt=""><figcaption></figcaption></figure>



{% hint style="info" %}
Interpreter orchestration is a feature that is available ON DEMAND.  If you would like to use this feature, please reach out to support@opendialog.ai.
{% endhint %}

## The basics

Interpreter orchestration allows you to pick one interpreter to prioritise during your conversation. This can be accessed via the side panel of the conversation designer, through the interpreter drop-down. From here, you are able to see all of the available interpreters you can select for that specific conversation. This functionality can be accessed at the following levels:

* Scenario
* Conversation
* Scene
* Turn&#x20;

By integrating Interpreter Orchestration into your workflow, it will allow for you to set highest priorities and be able to create smoother, more efficient running conversations with OpenDialog.

## Interpreter Orchestration in action

### Organise your interpreters

When designing a conversation with OpenDialog, you can set up multiple interpreters. Whether that be the OpenDialog interpreter, a self made language service or from a third party source; such as Open AI or Amazon LEX. Although having access to all these interpreters is useful, it can sometimes become confusing to know which ones are best for certain elements of your conversation. &#x20;

Through Interpreter Orchestration, you are able to choose which interpreter to set as a highest priority, meaning that this one will be checked and run through first when requesting an intent. This feature influences the conversation engine by giving a tool to designers to control what is important to a specific part of their conversation.

### Set interpreters throughout

Sometimes, just having one interpreter for your entire scenario doesn't work. With multiple conversations, turns and scenes, you may want to prioritise more than one interpreter throughout the journey.&#x20;

With Interpreter Orchestration, you can do just this! The prioritisation drop down is available from the side panel of the conversation designer at scenario, conversation, turn and scene levels. This means that you are able to set a priority for that specific component, instead of for the entire conversation

## Where to find

The Interpreter Orchestration functionality can be accessed from the side panel of the conversation designer.

<figure><img src="../../.gitbook/assets/Group 5 (1).png" alt=""><figcaption></figcaption></figure>

To access the Interpreter Orchestration feature within the intents sidebar for a given scenario:

* Go to your workspace overview (Scenarios)
* Select the scenario you would like to update
* Click 'Interpreter' from the side panel
* Choose the interpreter you would like to prioritise for that scenario

<figure><img src="../../.gitbook/assets/Screenshot 2024-03-27 at 08.40.11.png" alt=""><figcaption></figcaption></figure>

This functionality can also be accessed from different component levels:

* Go to your workspace overview (Scenarios)
* Select the scenario you would like to update
* Select the conversation, scene or turn you would like to set your interpreter for
* Click 'Interpreter' from the side panel
* Choose the interpreter you would like to prioritise for that scenario

## How it works

By using interpreter orchestration, you are altering how the conversation engine reasons, and the order in which is will select intents.

At the start of an interaction, the conversation engine:

* Explores all starting conversations, all the starting scenes within these conversations, all the starting turns within those scenes and any request intents associated with those starting turns will be considered as possible starting intents
* Considers the incoming utterance and attempts to match it to one of the possible starting intents
* If the match is successful the conversation state is updated to that intent and we are now in a fully defined conversation state down to the level of an intent

This is how an interaction would usually take place within the conversation designer, however, interpreter orchestration changes this process slightly. For example:

At the start of an interaction, whilst using interpreter orchestration, the conversation engine:&#x20;

* Considers the incoming utterance and attempts to match it to one of the starting intents within the specified highest priority interpreter, instead of making it's way through all the available interpreters and language services.&#x20;

Through this, the process of intent matching is streamlined, and gives the designer more control of the flow of the conversation. By not interpreting the intents with low priority interpreters, this makes the engine a lot more effective.

## How to use - video

{% embed url="https://www.loom.com/share/ef6e52e9a2194c80bb2b22f04e2aee45?sid=87f3d5f7-b553-410b-a969-13672d8c1002" %}



