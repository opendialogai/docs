---
description: Turns in OpenDialog
---

# Turns and Intents

{% hint style="info" %}
Have you read our '[Getting started with OpenDialog](getting-started-1/getting-started-with-opendialog/)' section? If not, we would advise reading that before you dive into the content here as it gives an overview of the concepts behind OpenDialog.
{% endhint %}

Turns are contained within Scenes and represent the last conversational level for OpenDialog. 

![A Scene with two Turns](.gitbook/assets/image%20%28188%29.png)

![Scene settings view](.gitbook/assets/image%20%28187%29.png)

## Turn Behaviours

Turns have two behaviours

### Starting Turns

_STARTING_ turns are only considered when you join a scene for the first time. After the first interaction within the Scene starting turns are no longer considered. 

### Open Turns 

_OPEN_ turns are considered only after you've joined a scene and they are always considered while you are in the scene.

Turns can be both starting and open at the same time. 

## Intents in Turns

Turns contain a set of Response and Request intents. You can decide which participant \(the user or the application\) should initiate a turn. 

![](.gitbook/assets/image%20%28181%29.png)

You can have multiple intents in the request or response "buckets". 

![Request and Response Intents](.gitbook/assets/image%20%28183%29.png)

{% hint style="info" %}
Typically, you would either be using conditions \(on application intents\) or rely on the interpreters \(for user intents\) to determine which intent would actually be selected. 
{% endhint %}

You can also only have request intents, and you would then most likely be defining transitions within intents to move the conversation forward. 

An intent, from the user, is also referred to as an _incoming_ intent, while an intent from the application is referred to as an _outgoing_ intent. As the figure below illustrates an incoming utterance is interpreted to be matched on an incoming intent, and the Conversation Engine will then select an outgoing intent that we will map \(through the message repository\) to an outgoing utterance.

![Incoming and Outgoing Intents](.gitbook/assets/image%20%2880%29.png)

## Intent Settings

![Request Intent Settings](.gitbook/assets/image%20%28186%29.png)

Intents have a number of settings to help us manage it:

### Sample Utterance

The sample utterance is the phrase we use in the conversation flow and in the conversation designer to remind us of what content the intent is supposed to support in the conversation.

### Intent Name

The Intent Name is the more formal name for the intent that we use to refer to it through interpreters \(for incoming intents\) or in the message repository \(for outgoing intents\). A good naming format to use for this is `intent.user.<name of intent>` for user intents and `intent.app.<name of intent>`for app intents.

### Interpreter and Confidence Level

The Interpreter indicates which interpreter we will be using for the intent in question, while the confidence level determines the minimum confidence level acceptable for the intent. 

### Intent Behaviours

Yes, Intents have behaviours as well! Intents currently just have the _COMPLETING_ behaviour, which means that if the intent is matched it will also mark the conversation as completed. A completed conversation will take us back at the top of the scenario and look for another way in through STARTING conversations, scenes, turns, etc. 

### Transitions

Finally, intents can also cause transitions. What this means is that if the intent is matched it will cause a transition to another Conversation or Scene, and the Conversational State will pick up from there.

## Reserved Intent Names 

Some intents have special meanings in OpenDialog so it's worth highlighting those here:

### intent.core.welcome

This intent is mapped to an event from webchat - it is called whenever webchat loads for a new user and provides a way to kickstart the conversation. It is automatically set as the Request Intent of the Welcome Scene's Welcome Turn. 

### intent.app.end\_chat

This intent is fired when users click on the "End Chat" button of webchat. 

### intent.core.TurnNoMatch

If no interpreter is able to provide a positive interpretation of a user utterance the Conversation Engine will generate a TurnNoMatch intent and attempt to find a Turn within the scene that can handle it. 

### intent.core.SceneNoMatch

If no turn within the current scene handles the `intent.core.TurnNoMatch` the Conversation Engine will generate a Scene No Match and escalate a level above to try and find a match for that. 

### intent.core.ConversationNoMatch

If no scene within the current conversation handles the `intent.core.SceneNoMatch` the Conversation Engine will generate a Conversation No Match and escalate a level above to try and find a match for that. 

### intent.core.NoMatch

This intent is fired by the Conversation Engine whenever all interpreters return a no match and no lower-level No Matches \(described above\) were caught. 

Currently, this is automatically set as the Request Intent of the No Match Turn in the No Match Conversation. 







