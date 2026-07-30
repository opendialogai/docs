---
title: Topic Conversation
description: The Topic Conversation of the Start From Scratch Scenario
---

The Topic conversation is the more complex conversation in this Scenario as it lays out the structure to deal with a number of different generic topics in a fluid conversational way.

![](~/assets/image-6-1.png)

*The Topic Conversation*

Every Scene in the Topic Conversation follows the same pattern.

1. All Scenes have the _starting_ behavior. So once we are in the Topic Conversation we consider all Scenes.
2. Each Scene has one or more Turns that are also _starting._
3.  ![](~/assets/screenshot-2024-11-09-at-18-24-23.png)   Each Turn starts with a user Intent that corresponds to an Intent of the Query Classifier Semantic Classifier.
4. Each Turn then also has a response intent.
5. ![](~/assets/screenshot-2024-11-09-at-18-23-33.png)  Once we've responded to the user we redirect the context to the start of the Topic Conversation once more so the cycle can repeat.
6. Most APP intents have a dynamic response generated using an LLM action.

What this patterns allow us to do is move between the different scenes on every user query with flexibility since after every response we go back to the "top" of the Topics conversation.

In addition, the Topic Conversation has a No Match Scene that means we can capture anything that our Query Classifier has not interpreted contextuall and deal with it in the Topic Conversation.

![](~/assets/screenshot-2024-11-09-at-18-28-28.png)

*The Topic Conversation*
