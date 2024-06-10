---
description: This pattern allows the user to end the chat.
---

# End chat

This functionality is not activated by default; it must be activated in the Interface Settings page:

<figure><img src="../../../../../.gitbook/assets/2023-11-09_19-07-11.png" alt="" width="375"><figcaption><p>End chat toggle in interface settings</p></figcaption></figure>

<figure><img src="../../../../../.gitbook/assets/2023-11-09_19-08-09 (1).png" alt="" width="366"><figcaption><p>End chat link in user interface</p></figcaption></figure>

Clicking on the **End Chat** button generates an intent to end the chat. Similar to no match and restart, the conversation engine will look for an intent.core.TurnEndChat intent in a turn in the current scene. If no intent is found, the engine will look for an intent.core.SceneEndChat intent in the conversation, and if no intent is found, the engine will look for an intent.core.ConversationEndChat.&#x20;

If none of these are found, the global intent.core.endChat is executed.&#x20;



{% hint style="warning" %}
Note the End Chat is not handled out of the box; you will need to set this up in your scenario.&#x20;
{% endhint %}

