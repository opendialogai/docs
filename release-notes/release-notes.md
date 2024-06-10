---
description: >-
  Learn about our product's newest updates and enhancements that will make your
  conversational applications better.
---

# Release Notes

## April 2024

#### <mark style="color:purple;">Coming soon!</mark>

## March 2024

#### <mark style="color:purple;">New Features</mark>

[<mark style="color:blue;">**Interpreter Orchestration:**</mark>](../opendialog-platform/interpreters-and-natural-language-understanding/interpreters/interpreter-orchestration.md) By integrating Interpreter Orchestration into your workflow, it will allow for you to set highest priorities and be able to create smoother, more efficient running conversations with OpenDialog.

{% hint style="info" %}
Interpreter orchestration is a feature that is available ON DEMAND.  If you would like to use this feature, please reach out to support@opendialog.ai.
{% endhint %}

#### <mark style="color:purple;">Improvements</mark>

We also made some improvements & bug fixes throughout the product.

Some of the updates:

* Message Editor : Button message now defaults to not allow continued interactions
* Message Editor : You can now change the order of your message blocks using drag and drop

## February 2024

#### <mark style="color:purple;">New Features</mark>

* [<mark style="color:blue;">**Attribute management**</mark>](../core-concepts/contexts-and-attributes/attributes.md)<mark style="color:blue;">**:**</mark> By integrating Attribute Management into your workflow, you can streamline the process of personalising conversations. Whether you're modifying existing attributes or introducing new ones on the fly, this feature simplifies the customisation process, enhancing the efficiency of your interactions.

#### <mark style="color:purple;">Improvements</mark>

A significant number of improvements & bug fixes have been made throughout the product to improve the conversation design experience.

Notable updates:

* Allow designers to add placeholder text to form messages
* Cancel button is now configurable in the message editor for form messages
* Fixed the OpenAI OD-managed language service to return results
* Fix to alias embed code to support nu-webchat scenarios



## December 2023 - Proxima&#x20;

{% embed url="https://youtu.be/KTIIq9DsEbc?si=5JJLEcE9F6xIdZWE" %}

#### <mark style="color:purple;">New Features</mark>

* <mark style="color:blue;">**Language Services:**</mark> Thanks to OpenDialog Language Services, you can easily manage your language model directly within the tool.  This feature is now generally available (previously in Beta)
* <mark style="color:blue;">**Aliases :**</mark> OpenDialog [Aliases ](../opendialog-platform/launching-your-application.md)allows you to create a single point of reference for your Web Chat application. This functionality enables you to alternate different scenarios at any given time. &#x20;
* [<mark style="color:blue;">**NEW WEBCHAT**</mark>](broken-reference)<mark style="color:blue;">**!**</mark>
  * OpenDialog webchat becomes more intuitive and highly customizable to adapt your branding through advanced Interface settings, theming, and custom messages.&#x20;
  * Thanks to the integration with Speech-to-Text, users can now input their information and queries by voice.
  * Existing messages have been given a new look and feel, and a new set of custom messages has been introduced in new webchat as part of this release, and will continue to be updated in upcoming releases.

#### <mark style="color:purple;">Improvements</mark>

OpenDialog [Integrate](../developping-with-opendialog/actions.md) has been enhanced with integrations that offer the possibility to send end-user requests through a ticketing system, to a live agent or trigger an e-mail.

## September 2023

#### <mark style="color:purple;">New Features</mark>

* <mark style="color:blue;">**Set Attributes to Value on Intents:**</mark> You can now design intents to set a value against a certain attribute based on the fact that this intent gets triggered. As an example : you can add the value 'done' to an attribute 'welcome' based on whether or not the WelcomeIntent was triggered.  This allows you to set up even more varied conversational flows determined by whether a user has 'visited' a certain intent, or segment a user by the fact that certain intents were triggered.
* <mark style="color:blue;">**Autosaving intents:**</mark> With this release, we are introducing an Autosave functionality to the Intent settings in the Conversation Designer. You no longer have to remember to Save or Update your settings with every edit you make to your intents, we will do it for you - saving you time and headspace!

#### <mark style="color:purple;">Improvements</mark>

* We have fixed a persistent bug in the product related to the description boxes for the different components in the Conversation Designer.  All updates to these descriptions will now get saved and updated seamlessly.

## July 2023

#### <mark style="color:purple;">New Features</mark>

* <mark style="color:blue;">**Language Services:**</mark> OpenDialog introduces Language Services, a centralized no-code interface for integrating, managing, and training your language models directly in OpenDialog. Available language services currently include : OpenDialog default intent classification, OpenAI-powered intent classification.  Further language services will become available soon, including embeddings-powered Q\&A.&#x20;

{% hint style="info" %}
This feature is currently in beta release and available on demand. If you want to access Language Services, get in touch via support@opendialog.ai&#x20;
{% endhint %}

* <mark style="color:blue;">**Send to Email:**</mark> You can now trigger an e-mail to be sent during a user's conversation with your application, personalizing its content with variables from the context.
* <mark style="color:blue;">**Microsoft Conversation Analysis Interpreter:**</mark> OpenDialog allows you to integrate with your own language models via our [Interpreter](../opendialog-platform/interpreters-and-natural-language-understanding/) feature.  Our Interpreter feature now also supports integration with the Microsoft Conversation Analysis service.
* <mark style="color:blue;">**Microsoft Question Answering Interpreter:**</mark>  OpenDialog allows you to integrate with your own language models via our [Interpreter](../opendialog-platform/interpreters-and-natural-language-understanding/) feature.  Our Interpreter feature now also supports integration with the Microsoft Question Answering service.
* <mark style="color:blue;">**Webhook interpreter:**</mark> In July, we also added a webhook interpreter to integrate with external language models without direct OD integration through webhooks. &#x20;

#### <mark style="color:purple;">Improvements</mark>

* We have added two new actions to the [Action Library](../opendialog-platform/actions/actions-from-library/): storing the state of the conversation in the user context and returning to that state during the conversation.
* Persistence of the user context when using virtual intents
* Performance fixes&#x20;

## June 2023

#### <mark style="color:purple;">New Features</mark>

* [**Freshdesk integration**](../opendialog-platform/actions/actions-from-library/freshdesk-action.md): The Freshdesk action lets you set up a connection between OpenDialog and your Freshdesk ticketing system, which you can then use within your conversation design.
* <mark style="color:blue;">**Conversation hand-off**</mark>: OpenDialog now allows you to set up a seamless handover to a human agent without interrupting the conversation.&#x20;

#### <mark style="color:purple;">Improvements</mark>

* Improvements to [Translate](../translating-your-application.md)
* Performance fixes for [Analyze](../monitoring-your-application.md)
