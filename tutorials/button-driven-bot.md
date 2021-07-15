---
description: >-
  A tutorial to guide you through the process of building a button-driven (or
  guided) conversation and a quick view of how you can test natural language
  conversations.
---

# Designing a basic flow and controlling with buttons

We outlined the basics of [managing messages](../getting-started-1/getting-started-with-opendialog/messages.md) and how they relate to intents within the getting started with OpenDialog section. We will use this section to dive further into the different messages types we currently support through the message editor UI. We are continually adding more and more UI widgets to make it easier for you to create smarter and more engaging conversational applications. 

{% hint style="warning" %}
If you can not find the message type you require below, you can find a full list of supported messages not available via the UI  through "Custom Message" and an explanation of the underlying XML structure [here](../developing-with-opendialog/message-markup.md).
{% endhint %}

### 1. Finding the message editor

There are multiple ways to find and then edit messages within OpenDialog. 

**Route 1:** From within the Designer. You find the message editor by clicking on the message icon in the action bar on the Scenario, Conversation, Scene, Turn or Intent node view. 

![Conversation node view](../.gitbook/assets/image%20%28291%29.png)

**Route 2:** Through the 'message editor' menu item in the left-hand navigation. Through this route, you will need to first select the scenario that you want to edit/add messages for. 

![Message Editor: Scenario selector](../.gitbook/assets/image%20%28305%29.png)

### 2. Finding specific messages

Once you've opened up the message editor, depending on the chosen route to enter, you will see either the full list of intents for an entire Scenario or a filtered list depending on the level you entered the editor through e.g. only intents for one Turn if clicked through from the Turn level in the designer.

To help with understanding which intent you're viewing, at the top of the screen you can see a list of links under the title 'Conversational context'. These outline which group of intent you're seeing. They are also clickable to help jump back to view more intents.

![Message editor: Conversational context visible ](../.gitbook/assets/image%20%28307%29.png)

### 3. Editing a specific message

To edit a specific message you need to click on it to open up the individual intent screen that has either one message or multiple messages visible e.g. one for new users and one for logged in users _\(if you're using conditions - more on that later\)._

![Message editor: Intent view](../.gitbook/assets/screenshot-2021-07-15-at-10.50.25.png)

To then edit the message you click on the edit icon. You can also duplicate OR delete each message.

![Message editor: Edit screen.](../.gitbook/assets/image%20%28310%29.png)

Once into the message editor, you will see the following options available to you:

* **Message name:** This is purely to help you identify specific messages. So for our example of new and returning users, we might call this 'welcome message - new user' and the other 'welcome message - returning user'.
* **Layout:** This is where you can design your messages, add conditions to your messages and set behaviours such as disabling text input & hiding the app avatar - _More on this further in the section._
* **Preview:** This will show you a preview of what your message will look like.
* **Conversation Designer:** This shows where in your conversation this message is going to be located.

### 4. Designing my message

To design your message you can simply click on the different message blocks to add those to the design. You will see each of them appear below. You can then go ahead and add your message content. 

One each of the blocks, you can delete it and/or duplicate it by clicking on the relevant icons. 

We will dive into the different message types that are available via the UI individually within this section.

### 5. Message types

Below is the full list of message types that are available through the message editor UI. We are continually adding more and more UI widgets to make it easier for you to create smarter and more engaging conversational applications. 

{% hint style="warning" %}
If you can not find the message type you require below, you can find a full list of supported messages not available via the UI  through "Custom Message" and an explanation of the underlying XML structure [here](../developing-with-opendialog/message-markup.md).
{% endhint %}

#### Text message

A text message is a plain text message which just includes text. You can add as many text blocks to your message as required. The text block only accepts plain text. If you want to include a link, you can do this by pasting the full URL, this will then be shown as a clickable link in webchat.  

![Message editor: Text messages](../.gitbook/assets/image%20%28308%29.png)

#### Image message

An image message allows you to display an image and include an optional link behind it to make it clickable. You have the option to enable this to open in a new tab or not. To add an image you will need to  host the image somewhere; either on your website or in an Amazon S3 bucket, then paste the URL in the 'Image source' field. See the example below.

![Message editor: Image message.](../.gitbook/assets/image%20%28296%29.png)

#### Button message

The button message type allows you to create button driven applications like [this tutorial \(Designing a basic flow and controlling with buttons\).](button-driven-bot.md) 

You can add only one button message type to each message, however, within that you can add as many buttons as you require. You can do this by clicking on the + next to the message you require the button to appear afterwards. Right now you can not reorder the buttons, so they need to be added in the right order. 

![Message editor: Button message type](../.gitbook/assets/image%20%28290%29.png)

Within the button block, you can add some plain text \(_if you've not already using the text block_\) and then edit/add new buttons. Within each button you can add:

* **Button text:** This is the text that is visible on the button
* **Button functionality:** This is the action that you would like the button to perform e.g. open an external URL or transition the user to another intent \(you'll have seen this in the [buttontutorial](button-driven-bot.md)\).





#### Custom message 





