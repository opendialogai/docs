---
description: Turns in OpenDialog
---

# Turns and Intents

Turns are contained within scenes and represent the last conversational level for OpenDialog. 

![A scene with two turns](.gitbook/assets/image%20%2887%29.png)

![Turn Settings](.gitbook/assets/image%20%2884%29.png)

## Turn Behaviours

Turns have two behaviours

### Starting Turns

_STARTING_ turns are only considered when you join a scene for the first time. After the first interaction within the scene starting turns are no longer considered. 

### Open Turns 

_OPEN_ turns are considered only after you've joined a scene and they are always considered while you are in the scene.

Turns can be both starting and open at the same time. 

## Intents in Turns

Turns contain a set of response and request intents. You can decide which participant \(the user or the application\) are to initiate in a turn. 

![](.gitbook/assets/image%20%2886%29.png)

You can have multiple intents in the request or response "buckets". 

![Request and Response Intents](.gitbook/assets/image%20%2883%29.png)

{% hint style="info" %}
Typically, you would be either be using conditions \(on application intents\) or depend on the interpreters \(for user intents\) to determine which intent would actually be selected. 
{% endhint %}

You can also only have request intents, and you would then most likely be defining transitions within intents to move the conversation forward. 

An intent from the user is also referred to as an _incoming_ intent, while an intent from the application is referred to as an _outgoing_ intent. As the figure below illustrates an incoming utterance is interpreted to be matched on an incoming intent, and the conversation engine will the select an outgoing intent that we will map \(through the message repository\) to an outgoing utterance.

![Incoming and Outgoing Intents](.gitbook/assets/image%20%2880%29.png)

## Intent Settings

![Request Intent Settings](.gitbook/assets/image%20%2882%29.png)

An intent has a number of settings to help us manage it.

### Sample Utterance

The sample utterance is the phrase we use in the conversation flow and in the conversation designer to remind us of what content the intent is supposed to support in the conversation.

### Intent Name

The Intent Name is the more formal name for the intent that we use to refer to it through interpreters \(for incoming intents\) or in the message repository \(for outgoing intents\)

