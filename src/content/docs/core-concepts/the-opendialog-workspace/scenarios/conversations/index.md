---
title: Conversations
---

Conversations represent the high-level goals or states of our scenario.

## Conversation settings

Settings include a conversation name, whether the conversation exhibits starting behavior, and selecting the default interpreter to use.

![](/.gitbook/assets/2023-05-18_15-08-12.png)

*Conversation settings*

Clicking "Add new condition" opens the New Condition area:

![](/.gitbook/assets/2023-05-18_15-09-06.png)

*Conversation settings expanded*

Conditions allow you to check values of attributes within contexts. The conversation will be considered if the conditions are met.

Example: imagine you are building an ecommerce scenario and you have unregistered and registered users. Registered users may get welcomes with different options, e.g. maybe they are shown some deals that unregistered users won't see. It may well be helpful to set up a conversation where the condition is that the user is recognized as a registered user while there is another conversation for unregistered users.

[Learn more about conditions here.](/core-concepts/contexts-and-attributes/conditions-and-operators)
