---
description: Turns in OpenDialog
---

# Turns and Intents

Turns are contained within scenes and represent the last conversational level for OpenDialog. 

![A scene with two turns](.gitbook/assets/image%20%2884%29.png)

Turns contain a set of response and request intents. You can decide which participant \(the user or the application\) are to initiate in a turn. 

![](.gitbook/assets/image%20%2883%29.png)

## Intents in Turns

You can have multiple intents in the request or response buckets. 

![Request and Response Intents](.gitbook/assets/image%20%2881%29.png)

Typically, you would be using conditions on the intents or depend on the interpreter values to determine which intent would actually be selected. 

