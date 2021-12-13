---
description: >-
  A tutorial on how to build a product chooser and product support app within
  OpenDialog
---

# Product Chooser

{% hint style="success" %}
The product chooser and product support application is available as a template within OpenDialog SaaS ([signup now!](https://opendialog.ai)) and you can test it out [here](https://opendialog.ai/case-study-perfectfit/).&#x20;
{% endhint %}

## Overview

The Product Chooser Template is an OpenDialog Conversational Application (for the webchat interface) designed to help customers choose a product from recommendations which are generated after they've answered a few validating questions.

![Product Chooser Webchat Demo](<../../.gitbook/assets/OpenDialog - Preview - Google Chrome 2021-12-09 09-03-23.gif>)

The scenario was originally built around the use case of a customer looking for a pair of running shoes. However, the structure can be adapted to fit any situation where the aim is to provide some recommendations after having collected some relevant information.

### Key features of this template to note:

* Flexible information gathering in context, tailoring to multiple, possible, conversational patterns including FAQ questions, updating gathered information and more...
* Support for side conversations throughout the conversation, allowing users to sidetrack and the application to provide contextual, graceful, just-in-time recovery.
* FAQ setup  for easy integration with your knowledge base or Q\&A-interpreter service
* Rich carousel messages allowing to expose recommended products and interactive menus, to help guide the users during their choice of a product
* Form messages to collect relevant information from the user

## Key Conversations

These are the key conversations:

**Welcome Conversation** - Welcomes the user to the experience, provides support for them to move forward to the "Gather Experience" conversation and  also supports FAQ questions.&#x20;

**Gather Experience** - The main objective of this conversation is to gather the key pieces of information required to provide some recommendations to the user.

**Recommendations** - In this conversation, the application will provide recommendations to the user.  The user can then either continue the conversation or make a change to their previous choices.&#x20;

**Purchase** - After a user picks a product we move them to the Purchase phase where they can complete relevant information and pay for the product.&#x20;

**Feedback** - **** The Feedback conversation allows you to gather relevant feedback from the user after their purchasing experience or when they decide to end the conversation. &#x20;

**Offboard** - The Offboard conversation offboards the user with an appropriate message.&#x20;

**No Match Conversation** - This catch-all 'No Match' conversation allows the application to fail gracefully when any intent parsing goes wrong. The template caters for localised no matches as well (i.e. No Match turns within a scene). You can find out more about this [here](https://docs.opendialog.ai/adding-conversations#no-match-conversation).

**Trigger** - The Trigger conversation captures intents that are supposed to start the entire conversation such as when the user loads WebChat (`intent.core.welcome` ) or when the user clicks on the WebChat restart icon (`intent.core.restart`). You can find out more about this [here](https://docs.opendialog.ai/example-flows/contextual-restart-chat-end#conversation-structure).  We recommend not making any major changes to this conversation, unless you have a specific purpose in mind - as this might break the overall functionality of the application.
