---
description: The Global No Match Conversation of the "Start from Scratch" AI Agent
---

# Global No Match Conversation

The No Match Conversation provides the top level point where a No Match can be deal with.&#x20;

A No Match is "issued" by the OpenDialog Engine when no interpreted has found a matching intent at a certain context level.&#x20;

Keep in mind that the Topics conversation has its own No Match scene.&#x20;

<figure><img src="../../.gitbook/assets/Screenshot 2024-11-09 at 18.33.30.png" alt=""><figcaption></figcaption></figure>

When the No Match intent is matched 😉 we reply with a NoMatchResponse that uses an LLM Action - the No Match Response Generation action to generate an appropriate message.&#x20;

Immediately afterwards we issue the `intent.core.restart` intent as a [virtual intent.](../conversation-designer/message-design/subsequent-messages-virtual-intents.md) This will enable us to force a restart of the conversation.&#x20;

<figure><img src="../../.gitbook/assets/Screenshot 2024-11-09 at 18.35.20 (1).png" alt=""><figcaption><p>The No Match turn with a virtual intent</p></figcaption></figure>

{% hint style="info" %}
Forcing a restart of the conversation after a Global No Match can often make sense since it means that we've failed to interpret what the user said at all previous levels. It is adviced to avoid hiting the Global No Match as much as possible and instead introduce local No Match intents at various scenes as appropriate.&#x20;
{% endhint %}





