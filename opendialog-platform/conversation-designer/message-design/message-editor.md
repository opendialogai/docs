---
description: >-
  The Message editor gives us access to the messages in the scenario and allows
  us to add, edit and delete messages.
---

# Message editor

## Finding the message editor

There are two ways to access messages:

**Option 1:** The Messages functionality is available as part of the Design functionality. Design includes both Conversation, where the conversation design occurs and Messages, where we access the message editor and work on everything to do with the content and assistant prompts. If Messages is not viewable in the sidebar, click the carrot (down arrow) to the right of Design to expand.

<div align="left"><figure><img src="../../../.gitbook/assets/DesignOption_NotExpanded.png" alt=""><figcaption><p>Design option - not expanded</p></figcaption></figure></div>

<figure><img src="../../../.gitbook/assets/Group 24.png" alt=""><figcaption><p>Design option - expanded</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario you would like to edit
* Go to the Design section in the right hand navigation panel
* Click on the arrow to reveal the drop down
* Select 'Messages'
{% endhint %}

**Option 2:** From within the Conversation designer, navigate to the Message editor by clicking on the message icon in a Scenario, Conversation, Scene, Turn or Intent. This will take you directly to the messages related to the conversational component you are on (scenario, conversation, scene, turn or intent)

<figure><img src="../../../.gitbook/assets/Group 25.png" alt=""><figcaption><p>How to find the message editor</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario you would like to edit
* Go to the Design section in the right hand navigation panel
* Select 'Conversation'
* When on the conversation page, navigate to the top right hand corner
* Click on the message bubble, which is the middle option of three icons
{% endhint %}

## Finding specific messages

Which messages you see in the list of messages depends on the level at which you enter the Message Editor. For instance, if you entered the editor at the scene level, you would only see the messages for that scene. If you enter the editor at the highest level, you see all messages for the scenario.

Messages are associated with intents. For instance, a welcome message can be associated with an intent called "Welcome".

Several messages can be associated with a single intent. For example, for a Welcome intent, we can have a message specifically geared towards new users, and one geared towards existing users.

Our search functionality allows you to edit a specific word, sentence, or message. You can use OpenDialog Search to find a message or group of messages that contain the exact phrases or words you're looking for.

You can access the 'Search' functionality in the main scenario menu, which searches for content throughout Intents and Messages.

<figure><img src="../../../.gitbook/assets/Group 26.png" alt=""><figcaption><p>Search across Intents and Messaes using the search functionality in the main scenario menu</p></figcaption></figure>

To search for a specific message, click on the 'Search' item in the main scenario menu, and the search modal will appear right in the middle of your workspace. Then, enter your query in the search bar, and the modal will display the results instantly.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-06-05 at 15.36.41.png" alt=""><figcaption><p>Enter your search query in the search bar that appears when selecting Search in the main scenario menu</p></figcaption></figure>

By clicking on the appropriate search result from the list, you'll be directed to the chosen component, giving you the opportunity to edit the selected message with ease.

<figure><img src="../../../.gitbook/assets/Group 27.png" alt=""><figcaption><p>Message catalog</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario you would like to edit
* Go to the 'Search' section in the right hand navigation panel
* Click on the button to reveal the search pop up
* Start typing in what you are looking for
* Select the message you want from the results
{% endhint %}

{% hint style="info" %}
Note that the displayed messages in the message catalog are the sample message you have defined upon intent creation. The sample message is there to help you with the conversation design, and recognizing intents throughout the OpenDialog platform. When editing a message, this will not edit the sample message.
{% endhint %}

## Adding or editing a message

In the intent list, click the Edit icon for an existing message or click "Add a new message". An existing message can also be copied or deleted:

<figure><img src="../../../.gitbook/assets/Group 28.png" alt=""><figcaption><p>Multiple messages associated with a single intent</p></figcaption></figure>

The Edit Message screen allows us to change the Message Name and customise the layout using a number of different [message types](message-editor.md#message-types). These types are covered in the next pages of this section.

The following options are available in the Edit Message screen:

*   **Message name:** the name is purely to help you identify specific messages. The message name will automatically be prepopulated with the name of the app intent it is related to. Make the message names something that is easy to recognize and place. For ease of use and recognition, define your naming convention upfront when you start creating your conversational application.

    We recommend using the intent name, optionally followed by the condition if you are using one.

    _For example: WelcomeIntent - userID not set_
* [**Layout:**](constructing-messages.md) this is where you can build your message content, add conditions to your messages, and set behaviours such as disabling text input and hiding the app avatar.
* **Preview:** shows a preview of your message. More complex messages don't have a full preview available and are labeled in the preview by their message type.
* **Conversation Designer:** shows the current position in the Scenario where this message is located
*   [**Conditions**](message-conditions.md): in the conditions tab you will be able to define when your message gets selected by defining conditional rules.

    _For example: if userID is not set_
* **Behaviours:**
  * "Disable free-form user input field for this message" will ensure that the user is not able to send free-form text messages in response to this message. This is usually best used alongside a message block that the user can interact with, such as a button message or form message.
  * "Hide the avatar for this message" will ensure that Webchat doesn't display the avatar alongside the message.
  * **Message feedback** lets you control whether end users can rate this message in webchat (thumbs up/down):\n    \n    - **Inherit**: use the interface setting (default)\n    - **Enable**: show thumbs for this message\n    - **Disable**: never show thumbs for this message\n    \n    When message feedback is enabled, the preview can show the feedback widget for supported messages.
  * "Exclude markdown code from attribute filling" will ensure that any curly-braces `{}`included inside [markdown code blocks](http://commonmark.org/help/) (single or triple back ticks) will not be used in attribute filling. By default OpenDialog will presume any curly braces are being used as [attribute syntax](using-attributes-in-messages.md) and attempt to fill it's value, this behaviour excludes markdown code from being filled. This behaviour is useful if you need to use curly braces for things such as code snippets within your messages.

<figure><img src="../../../.gitbook/assets/Screenshot 2025-03-06 at 11.09.33 (1).png" alt=""><figcaption><p>Edit Message screen</p></figcaption></figure>

## Custom messages

Custom messages let you define message content using XML.

This is how you access message-type-specific attributes.

### Message feedback attribute (Custom Messages)

If you are using a custom message XML editor, you can control message feedback with the `enable_feedback` attribute:

- `enable_feedback="true"`: enable feedback for this message
- `enable_feedback="false"`: disable feedback for this message
- Omit the attribute: inherit the interface setting

### Expandable Message Attributes (Custom Messages)

When creating custom messages, you can add expandable attributes directly in the XML editor to make long content collapsible.

**Text Expand Example:**

```
expandable-text="true" expandable-text-height="2em"
```

or

```
expandable-text="true" expandable-text-chars="240"
```

**Message Expand Example:**

```
expandable-message="true" expandable-message-height="3em"
```

{% hint style="info" %}
The message editor preview will not show expand/collapse behavior. Use the full Chat UI preview to test expandable messages.
{% endhint %}

### **When to Use Expandable Messages**

We recommend using 'Expand' when additional detail is helpful but not required for basic understanding. The collapsed state should communicate the core message on its own.

{% hint style="success" %}
💡 **Key Question:** "If the user never expands this, will they still understand what's happening? If no, you're hiding too much."
{% endhint %}

Expansion should add depth, evidence, or secondary information — not essential context. This keeps message content scannable while allowing users to go deeper on demand.

**Good use cases:**

* Long LLM-generated responses where the summary is visible
* Detailed FAQ answers with the key point shown first
* Legal/terms content that most users won't need to read in full
* Supporting details that complement but aren't required for the main message

**Supported Message Types**

The following message types support expandable attributes:

| Message Type           | Text Expand | Message Expand |
| ---------------------- | ----------- | -------------- |
| Text Message           | ✅           | ✅              |
| Rich Message           | ✅           | ✅              |
| Button Message         | ✅           | ✅              |
| Form Message           | ✅           | ✅              |
| Full Page Form Message | ✅           | ❌              |

## Enriched user experience

OpenDialog's modular approach to messages allows you to take advantage of rich UI components, surface specific messages on your terms and personalize them to make them relevant to specific users or use cases. Check out the following sections to take your conversational application from simple question answering to a truly personalised hybrid experience :

<table data-view="cards" data-full-width="false"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-card-cover data-type="files"></th></tr></thead><tbody><tr><td><strong>Tailor the user experience</strong></td><td>Master the art of crafting powerful messages tailored to your specific needs, utilising OpenDialog's diverse range of <a href="message-types/">message types</a> to their fullest potential.</td><td></td><td><a href="constructing-messages.md">constructing-messages.md</a></td><td><a href="../../../.gitbook/assets/legoblocks.png">legoblocks.png</a></td></tr><tr><td><strong>Surface relevant messages</strong></td><td>Take advantage of OpenDialog's unique approach, using <a href="message-conditions.md">conditions</a> to surface relevant messages at the right moment in the conversation.</td><td></td><td><a href="message-conditions.md">message-conditions.md</a></td><td><a href="../../../.gitbook/assets/conditions (1).png">conditions (1).png</a></td></tr><tr><td><strong>Personalize the messages</strong></td><td>OpenDialog's <a href="using-attributes-in-messages.md">attribute</a> system will allow you to taylor your messages using these variables to surface personalised information.</td><td></td><td><a href="using-attributes-in-messages.md">using-attributes-in-messages.md</a></td><td><a href="../../../.gitbook/assets/personalisation.png">personalisation.png</a></td></tr></tbody></table>
