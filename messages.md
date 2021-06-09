---
description: Introduction to message management and creation in OpenDialog
---

# Messages

Messages are associated with intents that the application generates. At each level of a scenario, you can access messages through the message icon in the action bar. 

![Scenario Top Level view - Message icon in action bar](.gitbook/assets/image%20%28192%29.png)

The Message editor can give you a global view of all the messages associated with a scenario and you can dive into editing them.

![Message Editor](.gitbook/assets/image%20%28189%29.png)

An intent can be associated with multiple messages as we typically want to customize messages to specific users. For example, we could have different messages for logged-in users and logged-out users. We can define what message is shown through conditions. 

![Messages associated with welcome intent](.gitbook/assets/image%20%28112%29.png)

We support a range of message types and are adding more and more UI widgets to make it as simple as possible to create them. You can find a full list of supported messages through "Custom Message" and an explanation of the underlying XML structure [here](developing-with-opendialog/messages/message-markup.md).

![Editing a single message](.gitbook/assets/image%20%28115%29.png)



