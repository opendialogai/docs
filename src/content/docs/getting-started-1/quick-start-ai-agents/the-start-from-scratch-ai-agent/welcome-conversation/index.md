---
title: Welcome Conversation
description: The Welcome Conversation of the Start from Scratch Scenario
---

![](/.gitbook/assets/welcome-conversation.png)

*Welcome Conversation*

Users are directed to the Welcome Conversation from the Chat Management conversation, and then the Conversation Engine will select the Welcome Scene as it is the only _Starting_ scene (as indicated by the green dot).

![](/.gitbook/assets/welcome-scene.png)

*Welcome Scene*

The Welcome Scene has just one _Starting_ Turn - the Welcome Turn - with an APP message that will send an appropriate Welcome Message for the user.

![](/.gitbook/assets/welcome-turn.png)

*Welcome Turn*

The WelcomeResponse Message is a static message - you can customise it by editing it directly or turn it into a dynamic message by using an LLM action on the intent to generate a relevant welcome message.

![](</.gitbook/assets/image (4) (1) (1).png>)

If you visit the Preview section of the bot (under Test) you will see this message appear in WebChat. The `intent.core.welcome` intent was the incoming user intent (triggered automatically by the fact that WebChat loaded on the page). That intent (containted in the Chat Management conversation) then transitions the context to the Welcome Conversation where the OpenDialog Engine identified one possible response - the `WelcomeResponse` - which the associated message.

![](</.gitbook/assets/image (5) (1) (1).png>)

The WelcomeResponse intent then transitions us to the Topic Conversation where we are waiting for a message from the user. You can see the transition under "Transition to" in the WelcomeResponse intent.

![](</.gitbook/assets/Screenshot 2024-11-09 at 11.35.40.png>)
