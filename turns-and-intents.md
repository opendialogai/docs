---
description: Turns in OpenDialog
---

# Turns and Intents

Turns are contained within scenes and represent the last conversational level for OpenDialog. 

![A scene with two turns](.gitbook/assets/image%20%2885%29.png)

![Turn Settings](.gitbook/assets/image%20%2882%29.png)

## Turn Behaviours

Turns have two behaviours

### Starting Turns

_STARTING_ turns are only considered when you join a scene for the first time. After the first interaction within the scene starting turns are no longer considered. 

### Open Turns 

_OPEN_ turns are considered only after you've joined a scene and they are always considered while you are in the scene.

Turns can be both starting and open at the same time. 

## Intents in Turns

Turns contain a set of response and request intents. You can decide which participant \(the user or the application\) are to initiate in a turn. 

![](.gitbook/assets/image%20%2884%29.png)

You can have multiple intents in the request or response buckets. 

![Request and Response Intents](.gitbook/assets/image%20%2881%29.png)

{% hint style="info" %}
Typically, you would be either be using conditions \(on application intents\) or depend on the interpreters \(for user intents\) to determine which intent would actually be selected. 
{% endhint %}



