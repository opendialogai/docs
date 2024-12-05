---
description: The Chat Management Conversation of the Start from Scratch Scenario
---

# Chat Management Conversation

<figure><img src="../../../.gitbook/assets/image (3) (1).png" alt="" width="563"><figcaption></figcaption></figure>

The Chat Management conversation is a _Starting_ conversation. It contains scenes, turn and intents that handle chat management functionality. The green dots on top of the Scenes indicate that all of these Scenes also have the _Starting_ behavior. Finally, the turns within the scenes are also _Starting_ turns.&#x20;

{% hint style="info" %}
**Behaviors**: The **Starting** _behavior_ is a special condition that indicates to the OpenDialog Engine that the Conversation, Scene or Turn should be considered the _first_ time we _enter_ a particular context such as the when we evaluate the Scenario to identify a starting Conversation or when we evaluate a Conversation to identify a starting Scene or when we evaluate a Scene to identify a starting Turn! Once we are in a specific context (e.g. a specific Scene) we will consider only **Open** turns and not _Starting_ turns. This makes it possible to build flexible contexts that can handle a variety of user requests.&#x20;
{% endhint %}

The struction of the Chat Management Conversation is as follows (Scene > Turn > `Intent`)

* **Chat Start > Welcome >** `intent.core.welcome`**:** The intent that is triggered when Webchat loads. This intent is automatically sent by the WebChat widget. In your scenario you need to make sure that there is a starting intent that is&#x20;
* **Chat Restart > Restart >** `intent.core.restart`  **:** The intent that is triggered when user chooses to restart the conversation via the webchat menu.&#x20;
* **Session Expiration > Session Expire >** `intent.core.sessionExpired`**:** The intent that is triggered when the session time on a conversation has expired.&#x20;
* **End Chat -** `intent.core.EndChat`: The intent that is triggered when a user chooses to end the chat from the webchat menu.&#x20;

{% hint style="info" %}
The structure of these intents _`intent.core.intentName`_ is [reserved](../../../core-concepts/the-opendialog-workspace/scenarios/turns-and-intents.md#reserved-intent-names) to OpenDialog. The conversation engine treats these intents differently as they _escalate_ through the conversation. It means that you can _catch_ these intents at a local level (a specific turn or scene) before they _escalate_ to the global version (that for the Start from Scratch Scenario is available in Chat Management.&#x20;
{% endhint %}

{% hint style="success" %}
If you are wondering why we created separate scenes and turns for each one of these intents - it is to allow for potential changes in the future. For example, you may want to have different Chat Restart behavior based on the type of user, etc. You can, for example,   duplicate turns within the Chat Restart conversation to define other types of behaviors using conditions.&#x20;
{% endhint %}

