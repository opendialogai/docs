---
title: Global No Match Conversation
description: The Global No Match Conversation of the "Start from Scratch" AI Agent
---

The No Match Conversation provides the top level point where a No Match can be deal with.

A No Match is "issued" by the OpenDialog Engine when no interpreted has found a matching intent at a certain context level.

Keep in mind that the Topics conversation has its own No Match scene.

![](</.gitbook/assets/Screenshot 2024-11-09 at 18.33.30.png>)

When the No Match intent is matched 😉 we reply with a NoMatchResponse that uses an LLM Action - the No Match Response Generation action to generate an appropriate message.

Immediately afterwards we issue the `intent.core.restart` intent as a [virtual intent.](/opendialog-platform/conversation-designer/message-design/subsequent-messages-virtual-intents) This will enable us to force a restart of the conversation.

![](</.gitbook/assets/Screenshot 2024-11-09 at 18.35.20 (1).png>)

*The No Match turn with a virtual intent*

:::note
Forcing a restart of the conversation after a Global No Match can often make sense since it means that we've failed to interpret what the user said at all previous levels. It is adviced to avoid hiting the Global No Match as much as possible and instead introduce local No Match intents at various scenes as appropriate.
:::
