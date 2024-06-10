---
description: Customise the look and feel of the Webchat widget
---

# Webchat Interface Settings

The Interface Settings section of the OpenDialog admin is where you go to customise how the widget looks and behaves before [embedding](../../../developping-with-opendialog/webchat/load-webchat-within-a-page-element.md) it on your webpage.

The settings are currently GLOBAL and will affect all scenarios you have created, including ones that have already been published. Any changes saved are instantly applied and anyone using your bot going forward will see them. You can use the preview section to test out the widget and see how.

Any changes made to the fields are not saved until you click on the 'Save Settings' button at the top of the screen

![Save your settings changes using the save button](<../../../.gitbook/assets/image (359).png>)

## Sections

The settings are broadly split into 4 settings that affect different elements within the interface and how it behaves.

### General

![The General settings](<../../../.gitbook/assets/image (419).png>)

Here you can configure some overall settings for the widget:

**Header** - Control the chatbot logo and title that appear in the header. If no value is set, nothing is shown.

**Chatbot** - Controls the global name and avatar used for the messages from the chatbot. The avatar can be turned off for individual messages in the message editor.

**Messages** - Toggle whether the time of the message is shown underneath each message.

**Typing Event** - The length of time (in milliseconds) that the typing indicator should be shown for each message.

**Chatbot Controls** - Controls whether various buttons are displayed on the chatbot. The download button allows the user to download a text copy of the chat log. [More info on restart and end chat can be found here](../conversation-design/conversational-patterns/building-robust-assistants/contextual-restart-chat-end.md)&#x20;

**Start Options** - When a chat session starts, the widget works out whether we are dealing with a new user (someone we have never seen before), a returning user (someone who we have seen before but is not in a conversation) or an ongoing user (a user we have seen before who is in a  conversation). These options allow you to chose if the widget should start minimised and less intrusive for any of these user types.

### CSS

![CSS Options](<../../../.gitbook/assets/image (55).png>)

Here you can upload custom CSS files to completely customise the chat widget. There are 2 files you can add:

**CSS for Chatbot** - This will be loaded inside the chat widget and is used to alter things about the widget

**CSS for page -** This is loaded on the parent page that the widget is on. This allows for customisation of things like size and position of the widget

### Layout Settings

![Alter the colours used in the bot](<../../../.gitbook/assets/image (285).png>)

Here you can adjust the colours used in the bot from the chat window itself to the messages and buttons.&#x20;

{% hint style="warning" %}
**Remember:** Please ensure that the colours you pick are compatible with each other and content will be readable
{% endhint %}

### Conversational History Settings

![Adjust what history is shown to the user](<../../../.gitbook/assets/image (528).png>)

Here, you can control whether the interface shows a user their previous chat history on load, and if so, how many messages to show. You can test how this behaves by using the preview section and **refreshing** the page on your browser rather than clicking the 'Refresh Scenario' button as this will generate a new user.
