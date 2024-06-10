---
description: >-
  How contextual and global FAQ, no match, and help patterns make conversations
  more robust
---

# Building robust assistants

If you've ever listened to a conversation between people, you may have noticed that these interactions are often not linear even when the conversation is had with a goal in mind, for instance to complete a task. Often enough, one of the parties will ask for clarification about what is said, they will ask the other speaker to repeat themselves, they will bring up a tangential topic (how often do people say: "oh, sorry, I went on a tangent"), switch to a different topic altogether, or jump back to an earlier point in the conversation. If the conversation has any length and if the topic is somewhat complex, there will be deviations, unless 2 robots are talking to each other. :-)

In order to model conversations that can deal with deviations, we bring in constructs such as an FAQ turn to handle questions users may have. We add a no match turn to intercept situations where the assistant was not equipped to handle the user's request, or perhaps the user wasn't cooperative and we want to rectify that. We also add ways for users to get help.&#x20;

When we add these constructs at the turn level, we can really customize and craft the conversation to get it back on track. For instance, if we asked the user&#x20;

OpenDialog patterns are particular ways to structure conversations in OpenDialog in a robust and reusable manner, and they can be applied in many different types of scenarios. These patterns are implementation patterns as they specifically indicate how to implement a conversation in OpenDialog.&#x20;

In addition to these implementation patterns, this documentation also features a section on conversational patterns in the Best Practices area. Conversational patterns are linguistic patterns, for instance ways to approach a welcome conversation. They are not patterns that help implementation in OpenDialog, but they are a helpful resource when building out your conversations.&#x20;

The next few pages illustrate our catalog of implementation patterns.&#x20;
