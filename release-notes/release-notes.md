---
description: >-
  Learn about our product's newest updates and enhancements that will make your
  conversational applications better.
---

# Release Notes

## October 2025

#### <mark style="color:purple;">New webhook action</mark>

<figure><img src="../.gitbook/assets/image (6).png" alt=""><figcaption></figcaption></figure>

#### New Features and Updates

Our brand new integration method with external resources is out! You can now:

* Utilize a variety of HTTP verbs.
* Use OD attribute syntax within URL-queries, path segments, or header values.
* Construct free-form JSON requests with inline values or OD attributes.
* Employ flexible syntax for mapping your JSON responses to OD output attributes.
* Save entire responses as strings.
* Access a new testing panel for this action.
* View action logs and aggregate information.

Contact us via email at [hello@opendialog.ai](mailto:hello@opendialog.ai) if you want this feature enabled for your workspace. Otherwise, it will become the default setting starting with the next release. Existing webhook actions remain unchanged, but creating new ones will not be possible in the future.

Additionally, we've made several improvements to the actions page:

* The card's header now displays the action name instead of the action type.
* All actions now have an optional description that will be displayed as a subtitle; if not provided, the action type will be shown.
* New webhook actions have an extra chip at the bottom indicating the HTTP verb used.

Check out more in our [documentation](../opendialog-platform/actions/webhook-action/).

## July 2025

#### <mark style="color:purple;">Role-based access</mark>

You can now manage user access with greater precision by assigning specific roles to users within your workspace. This ensures each user has access only to the functionality they need to perform their job. There are five available roles:

* **Admin**: Access to everything, including user management. Assign it to your power users who are responsible for the OD platform within your organisation.
* **Editor**: Has access to all features except user management. Ideal for builders and team members responsible for creating agents.
* **Analyse Guest**: Access to all scenario analytics. Assign it to stakeholders who are interested in monitoring your application's performance and extracting business insights.
* **Preview Guest**: Access to all scenarios previews. Assign it to your QA team and people who need to interact with the bot during development.
* **Preview & Analyse Guest**: Access to both preview and analyse within all scenarios. Useful for users whose role might require both testing and monitoring your agent.

For more information, look at [our documentation here](../core-concepts/the-opendialog-workspace/opendialog-account-management/create-and-manage-users.md#role-based-access-control).

#### <mark style="color:purple;">Improvements</mark>

* Resolved issue with fixed intent selection being hindered by the custom message editor.
* Fixed message ordering issue in WhatsApp.
* Implemented various improvements to the performance and security of our platform.

## June 2025

#### <mark style="color:purple;">Security section in the Interface Settings</mark>

We now have a brand new security tab for webchat interface settings which allows you to fine-tune your security requirements to validate anonymous access to the webchat, CSRF settings and specify authorized domains from which webchat should be accessible.

<figure><img src="../.gitbook/assets/image (584).png" alt=""><figcaption></figcaption></figure>

#### <mark style="color:purple;">Whatsapp and SMS integration</mark>

We are happy to announce that you can plug in OpenDialog conversations into WhatsApp or SMS so users can have more ways to interact with your OD application.&#x20;

Use the conversation designer to configure channel-specific messages like WhatsApp quick replies, cards, and carousels. Go to Analyze to see interaction logs from various channels.

_Note_: currently this feature is available on-demand, so if you want to try it out, reach out to our team via email [hello@opendialog.ai](mailto:hello@opendialog.ai).



<div align="left"><figure><img src="../.gitbook/assets/image (585).png" alt="" width="302"><figcaption></figcaption></figure> <figure><img src="../.gitbook/assets/image (586).png" alt="" width="358"><figcaption></figcaption></figure> <figure><img src="../.gitbook/assets/image (588).png" alt=""><figcaption></figcaption></figure></div>

#### <mark style="color:purple;">Improvements</mark>

* Removed extra confirmation toast when saving LLM Action with moderation off;
* Fixed header wrapping issue on a Webhook action;
* Fixed accessibility issue for minimize icon;
* Fixed issue where Analyze does not show Selected App intent information;
* Fixed download chat transcript functionality for SDK usage;

#### <mark style="color:purple;">Important deprecation notice</mark>

Just a reminder that from this month onward, the following endpoints are no longer supported:

* `/incoming/chatApi`&#x20;
* `/chatApi-config`&#x20;
* `/user/{user_id}/history`
* `/user/{user_id}/history/file`&#x20;

If you have any issues regarding the above, you can get help via our support form - [https://opendialog.ai/support](https://opendialog.ai/support/).

## May 2025

#### <mark style="color:purple;">Important deprecation notice</mark>

We've been undertaking a number of technical enhancements to streamline OpenDialog's internal systems, boosting performance, reliability, and security. As part of this work, the next major release will deprecate the following API endpoints

* `/incoming/chatApi`&#x20;
* `/chatApi-config`&#x20;
* `/user/{user_id}/history`
* `/user/{user_id}/history/file`&#x20;

\
Don't worry - you don't need to do anything from your side if you are using chat embed code or SDK!

However, if you are calling these endpoints directly from application code, you will have one month to align with the new API structure. Please refer to [the detailed upgrade guide](version-3-upgrade-guide.md) to find out what steps are.

#### <mark style="color:purple;">Refreshed look for scenario visualizer in preview</mark>

We made our scenario visualizer in preview and analyse a bit more convenient and useful when it comes to debugging your conversation:

* We added icons in section headings for better visual feedback;
* More information about run actions;
* Actions and conditions are now clickable and take you to where they are defined

<figure><img src="../.gitbook/assets/image (575) (1).png" alt=""><figcaption></figcaption></figure>

#### <mark style="color:purple;">Improvements</mark>

* Fixed Chatwoot integration when unable to send multiple messages in one go;
  * Also corrected Chatwoo client returning the wrong inbox `source_id` when contact has more than one inbox attachment;
* Fixed actions indicator component for USER intent card;
* Fixed interpreter confirmation popup shows even if no changes;
* Improved anti-brute force mechanisms and account locking;
* Fixed Z-index issue with attribute value sliding drawer on LLM Action page;
* Fixed missing "Download LLM action log" in scenario visualizer;
* Various important security patches;
* Few minor fixes on "My account" page.

## April 2025

#### <mark style="color:purple;">Visible actions and conditions on intent cards</mark>

To enhance clarity regarding conditions and actions tied to specific intent within Conversation Designer, we are rolling out an update that will visibly mark intent cards when they contain associated action or condition. Additionally, we've incorporated straightforward edit links directly on the interface of each intent card for immediate access to thisi elements:

<figure><img src="../.gitbook/assets/image (1) (4).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../.gitbook/assets/image (2) (5).png" alt=""><figcaption></figcaption></figure>

#### <mark style="color:purple;">Security updates</mark>

This release includes several important security updates. One of them being a stricter password policy. If your current password does not meet new strength criteria, upon next login you'll be prompted to reset it in accordance with these updated guidelines:

<figure><img src="../.gitbook/assets/image (3) (4).png" alt=""><figcaption></figcaption></figure>

#### <mark style="color:purple;">Improvements</mark>

* Fixed bug with empty bubble causing stalled conversation due to empty message;
* iframe option now has no effect when using SDK;
* Fixed intent links in conversation preview;
* Fixed bug for priority interpreter not set upon scene creation;
* Appearance improved and adjusted the wording to be clearer: "View all" button appears;
* Correctly on Language Services sidebar even with an overloaded interface;
* Clarity of status indicators enhanced across Knowledge Service topics page.

## March 2025

#### <mark style="color:purple;">"Tutorials" sidebar menu item</mark>

The first update for this month is a new sidebar item "Tutorials" featuring various how-to guides. We've added this enhancement to improve your learning experience, allowing you to access our learning videos, documentation links, and additional resources all in one convenient place.

<figure><img src="../.gitbook/assets/image (574).png" alt=""><figcaption></figcaption></figure>

#### <mark style="color:purple;">API for pre-populating user context for full-page webchat</mark>

The second one is a new API endpoint you can use for pre-populating user context for a conversation in full-page webchat. You send us initial attribute values for a given user, and in return, you'll get a link for a full-page webchat for this user with this data ready to go. More information is available [in our docs](../developing-with-opendialog/interaction-api.md).

#### <mark style="color:purple;">Improvements</mark>

* Fixed carousel slider styles;
* Fixed language switching in webchat via 3-dots menu;
* Removed redundant condition operator when there is only one condition;
* Added better feedback for webhook action failure so you can debug more effectively;
* Added links to language services in interpreter dropdown;
* Fixed default styles for tables and numbered lists in markdown messages;

## February 2025

This month, we have released a significant update to the preview page and made several general improvements to the system.

We reflected on our preview page and redesigned it to make testing your conversations more efficient.&#x20;

The preview console now takes up the full right side of the screen, featuring two tabs: "Conversation Logs" and "Attributes". This layout allows you to see incoming and outgoing intents more clearly, with the considered and selected paths easily accessible.&#x20;

In the "Attributes" tab, you'll find an enhanced search function and filters. Additionally, custom attributes are clickable and will take you directly to their management page.

Setting custom attributes to test specific paths of your conversation has also become a lot easier, as you can now set multiple attributes.

For more information, please [see the docs](../previewing-your-application.md).

<figure><img src="../.gitbook/assets/image (572).png" alt=""><figcaption></figcaption></figure>

#### <mark style="color:purple;">Improvements</mark>

* Fixed issue when Chatwoot integration is inactive by default
* Improved spacing for code blocks in markdown messages
* Made conversation intents clickable within considered and selected path panels
* Resolved bug with conditions during initial scene creation
* Moved the banner for quickstart AI agent to the Dashboard.

## January 2025

Happy New Year!  To start the year off with a bang, we wanted to give our messages even more flexibility.  Which is why, in this release, we are happy to introduce markdown support for our text messages.  In addition, we have been busy making improvements throughout the product, to make the usability of our product even smoother.

#### <mark style="color:purple;">Markdown support in text messages</mark>

Our text messages now support markdown. You can create bullet lists, bold/italic text, headings, links, images, code blocks, and tables using standard markdown syntax, and they will be rendered in webchat. For more information, please [see the docs](../opendialog-platform/conversation-designer/message-design/using-markdown-in-messages.md).

#### <mark style="color:purple;">Improvements</mark>

* Fixed the double-scroll bar issue on the preview page;
* Fixed leading and trailing whitespaces in webhook action headers;&#x20;
* Fixed sidebar overlapping with incoming intents in preview;
* Improved messaging for the semantic classifier test panel when no intents matched.

## December 2024

We are wrapping up this year with some user experience improvements and clearing some small flaws from our platform.

#### <mark style="color:purple;">Better visibility for your vectorisation queue quotas</mark>

We are delighted to present a tracker for your vectorisation usage restrictions. Each Topic page now features a progress bar that shows the number of jobs currently in progress and updates each time you add new items to the queue until you reach the quota. This should help you better understand how many jobs you can have per topic at any given time.

<figure><img src="../.gitbook/assets/image (4) (1).png" alt=""><figcaption><p>Capacity tracker for vectorisation quotas</p></figcaption></figure>

#### <mark style="color:purple;">Improvements</mark>

* Order list of available actions in conversation designer side panel alphabetically;
* Fix visibility issue for existing conditions on message card in message editor;
* Fix reCAPTCHA resubmission issue;
* Improve performance for dashboard page.

## November 2024

After all the significant changes we made in October, we've taken some time to further improve our existing features and improve usability across the platform, for you and your users.

#### <mark style="color:purple;">Improved user experience</mark>

Does it sometimes feel like it takes ages for the AI Agent to reply and you are worried that your users might feel something went wrong, or simply give up?  We've got you covered!

**Introducing...OpenDialog's interactive wait time indicator.**

<figure><img src="../.gitbook/assets/New waiting time (1).gif" alt=""><figcaption><p>OpenDialog's interactive wait time indicator</p></figcaption></figure>

Using our interactive wait time indicator, will :

* Keep users engaged without causing anxiety that something might be broken
* Enhance the sense of immediacy of the AI Agent's reply
* Provide agent ‘presence’ while the user is waiting
* Improve interaction quality and trust in your AI Agent&#x20;

Give it a try in your scenario's [Interface Settings](../opendialog-platform/conversation-designer/webchat-interface-design/webchat-interface-settings.md) and immediately notice the difference between occupied and unoccupied time!

#### <mark style="color:purple;">New Features</mark>

<mark style="color:blue;">**Improved indication in the navigation sidebar**</mark>

We have made improvements to the navigation sidebar for   language services and workspaces, as well as indicative labels for the different language service types.

<mark style="color:blue;">**Ability to duplicate actions**</mark>

In the three-dot menu for any action, you can now find a new option to duplicate this action so you don't need to start from scratch every time.

<mark style="color:blue;">**Condition Operators**</mark>

So far, conditions in OpenDialog inherently were considered as using the 'AND' operator.  We have now added the possibility for you to combine conditions differently, by letting you choose the operator that controls them : AND or OR.

#### <mark style="color:purple;">Improvements</mark>

* Performance improvements for webchat
* Fixed date picker message broken in some cases
* Improved messaging for when the vectorization queue is busy
* Fixed appearance of the page with aliases
* Ability to expand the semantic classifier prompt field
* Fixed long strings breaking the formatting of a list message
* Fixed data mismatch between the analysis page and API data export
* Fixed embed code button visibility

## October 2024

This month, we've got a LOT for you! Both things that please the eye and improve the quality of life on our platform!

#### <mark style="color:purple;">New Features</mark>

<mark style="color:blue;">**New designs for login and registration screens**</mark>

We've got a much better and slicker design for some of our pages, such as Login, Registration, and Reset Password.&#x20;

<mark style="color:blue;">**New sidebar**</mark>

Our new navigation pattern makes it easier for you to navigate the platform and accomplish your tasks more quickly. We've also uncovered some hidden gems like user management and attribute dashboard in case you knew it was there but were going to them via direct URL 👀

<mark style="color:blue;">**New way of creating scenarios**</mark>

Say goodbye to the snake animation (my favorite) on the scenario creation screen and behold a brand new one with an updated "Start from scratch" template, the ability to import scenarios, and visual updates to this one

#### <mark style="color:purple;">Improvements</mark>

So many improvements await you in this release, worth highlighting these ones:

* Allowed for different date/time formats via attribute filters.
* Updated the interface settings page to the latest relevant state.
* Added a setting in URL-source vectorization to omit HTML tags.
* New pop-up for prompt editing.
* Fixed the preview dropdown z-index.
* Fixed the "add scene/turn" button always showing the wrong sidebar on the first click.
* Fixed LLM Action output attributes not enforcing unique attribute names.
* Fixed the Card component being cut in half when the screen resolution is low.
* Fixed Activation toggles sitting outside of the Card component in LLM Actions.
* Fixed the confirmation popup when deleting an action.
* Activation toggles are now on by default on all system components.
* Unified the behavior of description fields.

## September 2024

A significant milestone in OpenDialog's evolution, bringing you an even more powerful way of building AI Agents!

#### <mark style="color:purple;">New Features</mark>

<mark style="color:blue;">**Semantic Intent Classifier**</mark>

Remember our intent classifiers? Imagine a world where you can define a simple list of  intents and a short description for each, and thats it. No example phrases, nothing! Any semantically matching user utterances will be classified as you want. Guess what? We did it! With our brand new semantic classifier you can do just this - specify an intent name, give it a description, choose an LLM engine which will be used to perform classification and use it in your scenario.

For more details check out our documentation [here](https://docs.opendialog.ai/opendialog-platform/interpreters-and-natural-language-understanding/language-services/semantic-intent-classifier).

<mark style="color:blue;">**RAG services**</mark>

We now have our very own support for Retrieval-Augmented Generation (RAG) which gives you the ability to generate contextually relevant responses, based on a semantic search over a vectorised knowledge base. You can now use _your_ data to feed into your AI agents and use this knowledge to drive conversations. Want your users to be able to ask questions about where to find a parking spot at your facility? No problem. You have complicated policy document and you want your AI agent to answer questions about its content? In OpenDialog, it has become as easy as ABC. With our RAG service you can use any custom URL, pdf, .csv, docx. xlsx file or just simply drop raw text and our RAG service will take it from there.

More in our docs [here](https://docs.opendialog.ai/opendialog-platform/interpreters-and-natural-language-understanding/language-services/retrieval-augmented-generation).

#### <mark style="color:purple;">Improvements</mark>

* Fixed issue with processing composite JSON object an output attribute from wehbook action
* Fixed unexpected behaviour when no-matching / escalation
* Fixed override input field in new webchat causes blocking error
* Removed character limit for webhook action URL
* Removed ability to create outdated interpreters such as LUIS, QnA and RASA. Existing scenarios which uses them will still work
* Added soft wrap for long component names
* Fixed stretched cards on dashbaord
* Added new "step" property to number input
* Added ability to map attributes from another attributes in "Set Attributes" action

## August 2024

#### <mark style="color:purple;">New Features</mark>

<mark style="color:blue;">**LLM Actions**</mark>

We've been working hard to bring  you an exciting new way to interact with LLMs, called [LLM Actions](https://docs.opendialog.ai/opendialog-platform/interpreters-and-natural-language-understanding/llm-actions)! It's like a usual action which you can attach to an intent but which will leverage LLMs to perform a task. Give it a system prompt, specify output attributes, configure moderation - and make your AI agent respond with dynamic messages, extract specific information from user utterance, format request to upstream webhook and much more. Check out [documentation](../opendialog-platform/interpreters-and-natural-language-understanding/llm-actions/) for detailed usage.

#### <mark style="color:purple;">Improvements</mark>

We didn't forget to do some housekeeping in our product so we did a few fixes, such as:

* Fixed akward minimize/maximize webchat behaviour
* Fixed download chat link with iphone not working
* Fixed lower options are hidden in dropdown menu
* New gpt-4o-mini model support

## July 2024

We've been busy  tidying up our product and making a lot of improvements and bugfixes, including:

* Fix for message history is not consistently ordered
* Allow free input for standart autocomplete
* Support for cancel functionality for different message types

And much more  :tada:

## June 2024

#### <mark style="color:purple;">New Features</mark>

* Added [address autocomplete](https://docs.opendialog.ai/opendialog-platform/conversation-designer/message-design/message-types/address-autocomplete-message) message
* Added [new location attribute](https://docs.opendialog.ai/core-concepts/contexts-and-attributes/about-attributes#location-attribute)
* Added support for GPT-4o model

Plus various bugfixes and improvements :tada:

## May 2024

#### <mark style="color:purple;">New Features</mark>

<mark style="color:blue;">**Message Design:**</mark>  Introducing further support via the Message Editor to use the different message types that were introduced during the Proxima release.  You can learn more on how to use these new [**message types**](../opendialog-platform/conversation-designer/message-design/message-types/) here:

{% content-ref url="../opendialog-platform/conversation-designer/message-design/message-types/" %}
[message-types](../opendialog-platform/conversation-designer/message-design/message-types/)
{% endcontent-ref %}

#### <mark style="color:purple;">Improvements</mark>

We also made some improvements & bug fixes throughout the core product, as well as webchat.

Some of the updates include :

* We have added GPT-4o to the managed available Language Services model
* We have added links in the Message Editor to the different message types for easy access
* We have updated the scrolling positioning when a message is served in webchat

## April 2024

#### <mark style="color:purple;">New Features</mark>

[**Accessibility**](../opendialog-platform/conversation-designer/designing-accessible-chatbots.md) :&#x20;

Webchat is now compliant with WCAG 2.2 standard 🎉 It consist of many little pieces like:

* Changed color contrast
* Highlighted focused elements
* Improved visual validation feedback on forms
* Font sizes using Em instead of pixels
* Keyboard navigation
* Screenreaders can read webchat
* Semantic changes to webchat HTML
* and many more...

#### <mark style="color:purple;">Improvements</mark>

We've made various improvements and bug fixes to the core product, including :&#x20;

* Support for regex validation in form messages
* UI fixes to a set of webchat messages&#x20;

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
* [<mark style="color:blue;">**NEW WEBCHAT**</mark>](/broken/pages/Yh2t7P90PzNprbtTVwtP)<mark style="color:blue;">**!**</mark>
  * OpenDialog webchat becomes more intuitive and highly customizable to adapt your branding through advanced Interface settings, theming, and custom messages.&#x20;
  * Thanks to the integration with Speech-to-Text, users can now input their information and queries by voice.
  * Existing messages have been given a new look and feel, and a new set of custom messages has been introduced in new webchat as part of this release, and will continue to be updated in upcoming releases.

#### <mark style="color:purple;">Improvements</mark>

OpenDialog [Integrate](/broken/pages/-MQM33QbO3LxSgzz40Lm) has been enhanced with integrations that offer the possibility to send end-user requests through a ticketing system, to a live agent or trigger an e-mail.

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

* We have added two new actions to the [Action Library](../designing-conversations/actions/actions-from-library/): storing the state of the conversation in the user context and returning to that state during the conversation.
* Persistence of the user context when using virtual intents
* Performance fixes&#x20;

## June 2023

#### <mark style="color:purple;">New Features</mark>

* [**Freshdesk integration**](../opendialog-platform/actions/actions-from-library/freshdesk-action.md): The Freshdesk action lets you set up a connection between OpenDialog and your Freshdesk ticketing system, which you can then use within your conversation design.
* <mark style="color:blue;">**Conversation hand-off**</mark>: OpenDialog now allows you to set up a seamless handover to a human agent without interrupting the conversation.&#x20;

#### <mark style="color:purple;">Improvements</mark>

* Improvements to [Translate](../translating-your-application.md)
* Performance fixes for [Analyze](../monitoring-your-application.md)
