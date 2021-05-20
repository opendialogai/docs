---
description: >-
  A pattern describing how you can provide contextual help to users while
  minimising the need for intent training
---

# Contextual Help

One of the challenges with conversations is providing the most contextual responses possible given the overall state of the conversation. This is particularly relevant when the user asks generic questions such as a request for help. 

OpenDialog provides an efficient way of dealing with this through a single help intent that can be trained once but reused multiple times contextually. 

Consider the following scene:

![A scene with contextual help](../.gitbook/assets/image%20%2899%29.png)

Here we have a scene where we will be gathering profile info from the user. We anticipate that the user may ask for help so we create an _OPEN_ help turn. An open turn is always considered so if the user says anything like: "help", "I require assistance", "what am I supposed to do", etc we expect the Help Turn to match. The response within the Help turn can be highly contextualised since we know that we are in the  Gather Profile Info scene.

The Turn Help will have two intents:

![](../.gitbook/assets/image%20%28100%29.png)

Here is what the configuration for the "request help" intent from the user will look like. 

![Request Help intent settings](../.gitbook/assets/image%20%28104%29.png)

The response intent from the bot can now provide help relevant to the context.

![Provide help intent settings](../.gitbook/assets/image%20%2897%29.png)

From an NLU perspective what is a significant advantage is that we can reuse the training for the request help Intent across multiple conversations \(even multiple scenarios\). At the same time we can contextualise our response based on needs.



 

