---
description: >-
  On this page, we will look at how to use the message editor to construct and
  build messages in OpenDialog
---

# Constructing Messages

In OpenDialog, messages are the primary means of interaction between your conversational interface and users. Understanding how to use the various message blocks available within the platform is crucial for crafting effective and engaging interactions.

## Designing a message

Message blocks are modular components that can be combined to form a complete message. Each block serves a specific purpose, allowing you to tailor your messages to the needs of your users and the goals of your application. By leveraging these blocks, you can construct messages that are not only informative but also interactive and user-friendly.

To design your message, click on any message block(s) to add those to the designer. You will see each of them appear, one after the other. You can then go ahead and add your message content as required.&#x20;

Each block can be deleted, duplicated or reordered using the relevant icons.&#x20;

<figure><img src="../../.gitbook/assets/image.png" alt=""><figcaption><p>Individual message screen to design your message</p></figcaption></figure>

## Combining message blocks

When constructing a message in the message editor, you don't just have the option of using only one message block. You can use a variety of different message blocks per message, to mix and match and convey what you want to say in a variety of different ways.

However, when you are putting certain message blocks together, there are a number of rules that you need to follow. This is because certain message blocks need to be in a certain position when being compiled with others. Below, some of the main rules have been highlighted for specific block types:

#### [Form message](message-types/form-message.md)

You can only add one form message type to each message, and it should be the last message in the list.&#x20;

#### [Autocomplete message](message-types/autocomplete-message.md)

When using an autocomplete message with other message block types, these must be the very last in the list. &#x20;

{% hint style="info" %}
Note that the autocomplete message will cause the user input field to be taken over by an autocomplete modal.
{% endhint %}

#### [Full page messages](message-types/full-page-message.md)

As a general rule for setting up messages with multiple blocks, it is always best practice to put any full-page messages to the end of your list. The full-page messages are:

* [Full page form messages](message-types/form-message.md)
* [Full page rich messages](message-types/full-page-message.md)
* [Location messages](message-types/location-message.md)
* [E-sign messages](message-types/e-sign-message.md)

## Reordering message blocks

Within every message type, there is also now a drag and drop feature for you to use.&#x20;

<figure><img src="../../.gitbook/assets/Group 10 (1).png" alt=""><figcaption></figcaption></figure>

To find the drag and drop feature, simply go to the top left hand corner of any message block and find the icon with 6 dots.

From here, you can grab and move your message block to it's desired place.
