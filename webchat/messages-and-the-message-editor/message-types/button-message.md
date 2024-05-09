---
description: This page describes where to use and find a button block message type
---

# Button Message

The button message enables you to create button driven applications. The Appointment Confirmation bot in the OpenDialog Academy is an example. To sign up for the OpenDialog Academy, contact academy@opendialog.ai.

You can add only one button message type to each message, however, within that you can add as many different buttons as you require. You can do this by clicking on the ＋ next to the button entry you require the button to appear afterwards. Right now you can not reorder the buttons, so they need to be added in the order you want them to appear.

![Message editor: Button message type](<../../../.gitbook/assets/image (279).png>)

Within the button block, you can add some plain text (_if you've not already used the text block_) and then edit/add new buttons. Within each button you can add:

* **Button text:** This is the text that is visible on the button
* **Button functionality:** This is the action that you would like the button to perform on click e.g. open an external URL or transition the user to another intent.&#x20;

![Button functionality: Options](<../../../.gitbook/assets/image (339).png>)

### **Button functionality**

Let's focus on transitioning to another intent _(Simulate user intent)_ as this action will likely be what you'll be wanting to perform most. There are two options here, either; locate an intent that you've already created from the drop-down or create a new intent.&#x20;

![Message editor: Simulate user intent](<../../../.gitbook/assets/image (386).png>)

To create a new one, you need to open the Conversation where the new intent needs to be located, click on 'Create new intent...' and then add the name and finally select the Scene then Turn it should live in (you can also create Scenes and Turns if required). Remember to click on ✔ to save before closing.

![Message editor: Create new intent.](<../../../.gitbook/assets/image (281).png>)

{% hint style="info" %}
**Reminder:** If you've created a new intent etc. Remember to go back into the Designer after you've saved the message to fine tune the settings of your new Intent, Scene and Turn. You will need to add behaviours, conditions and/or transitions.
{% endhint %}

### Button Values

Button messages also allow values to be assigned to each button so as well as simulating a user intent, they can assign a value to an attribute that can be saved against the user. \
\
For example, if a button message was created to allow a user to answer a question, 2 buttons could be added, 1 with a value of `yes` and one for `no`. The value can then later be used in conditions or actions to affect the conversation flow.&#x20;

#### Adding Button Values

Button values are added in the `Advanced settings` dropdown for buttons with the 'Simulate user intent' type behaviour selected in the 'Button functionality' drop down. The example given below will create a button message with 2 buttons - both will simulate the `AgeResponse` user intent, but each will save a different value against the `over18` attribute.

When a user clicks a button, by default the value will be saved to the user context for use later (_this can be altered by modifying an_ [_intent's advanced settings_](../../../the-opendialog-model/turns-and-intents.md#intent-settings))

![Adding button values through the message editor](<../../../.gitbook/assets/image (514).png>)

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

### **Button behaviours**

For the button message type, you can select a number of advanced behaviours depending on your use case.

* **Override user input field - show buttons as main interaction mode:** This option will hide the text input within Webchat and show the buttons as the main interaction at the bottom.
* **Allow continued interaction throughout the conversation:** This option will allow users to continue to interact with the buttons even if they have moved on from that part of the conversation. This is really useful for FAQ style chatbots.

#### XML Snippet

Button messages allow you to provide the user a number of options to select as a response. The basic mark up is:

```
<message>
    <button-message clear_after_interaction="true|false">
       <text>{button message text}</text>
        <external>true|false</external>
    </button-message>
</message>
```

Setting the `external` property to true results in the message buttons appearing outside of the button message (this defaults to false if not set).

{% hint style="danger" %}
**NB**

Button messages with external buttons must be the last message in the intent so they aren't overwritten by any subsequent message in the webchat view.
{% endhint %}

Setting the `clear_after_interaction` property to false means that the buttons will remain visible to the user after being interacted with

#### **Buttons**

A button message can contain 1 or more buttons for the user to interact with (some platforms have different restrictions on the number of buttons per message) Each button must define a `text` element to specify the text that should be shown to the user.

OpenDialog has built in support for 4 types of button:

#### **1. Callback buttons**

Callback buttons will send a `callback_id` (and optionally a `value`) when interacted with by the user that will move the conversation forward. Make sure that any `callback_id` you use in a button response is mapped to an intent in the interpreter engine config.

```
    <button>
        <text>Callback Button</text>
        <callback>callback id</callback>
        <value>attribute_name.attribute_value</value>
    </button>
```

Values can be optionally set on callback buttons to add some extra context to the button response. The format of button values is:

```
    attribute_name.attribute_value
```

where `attribute_name` should be the ID of an attribute that has already been defined in the system.

When passing through the Callback Interpreter, button values will be parsed and an attribute will be returned with the value set as per the button

**Example**

Here is are examples of a message with one button and two buttons. Clicking on the button would cause that callback value to be sent back to OpenDialog which could then be matched with an incoming intent.

```

<message>
    <button-message>
        <text> A bit of explainer text at the top </text>
        <button> 
          <text>Click me!</text>
          <callback>intent.app.startAConversations</callback>
        </button>
    </button-message>
</message>
```

```

<message>
    <button-message>
        <text> A bit of explainer text at the top </text>
        <button> 
          <text>Click me!</text>
          <callback>intent.app.startAConversations</callback>
        </button>
        <button> 
          <text>Or click me!</text>
          <callback>intent.app.startADifferentConversations</callback>
        </button>
    </button-message>
</message>
```

#### **2. Link buttons**

Links buttons are used to create links to other web pages. The `new_tab` property can be set to true to force the links to open in a new tab. If not set, links default to opening in the same tab

```
    <button>
        <text>Link Button</text>
        <link new_tab="true"|"false">http://example.com</link>
    </button>
```

**Example**

```
<message>
    <button-message>
        <text> Here are some very useful resources for you. </text>
        <button> 
          <text>Wikipedia</text>
          <link new_tab="true">https://wikipedia.org</link>
        </button>
        <button> 
          <text>W3C</text>
          <link new_tab="true">https://w3.org.org</link>
        </button>
    </button-message>
</message>
```

#### **3. Click to Call buttons**

Click to call buttons are used to create buttons for telephone numbers. They created a standard format `tel:` link that depending on the user's current device and platform will start a phone call to the number given

```
<button-message clear_after_interaction="0">
  <external>false</external>
  <button>
    <text>Button text</text>
    <click_to_call>07999812050</click_to_call>
  </button>
</button-message>
```

#### **4. Tab Switch buttons**

Tab Switch buttons should only be used for the OD Webchat platform in conjunction with comments and indicates that the button should switch the user to the 'comments' tab

```
<button>
   <text>Tab Switch</text> 
   <tab_switch>true</tab_switch>
</button>
```

#### **Button Types**

Buttons can be defined with a `type` that can affect how they are displayed as a button on screen. Types are added as properties of the button like this:

```
<button type="{type}">
    <text>Click me!</text>
    <callback>intent.app.startAConversations</callback>
</button>
```

There are currently 2 types that can be used:

* `skip` - If a button in an `external` button message has type of `skip`, it will appear below the other buttons with a different appearance. This can be used in conjunction with other messages to allow a user to skip past an intent
* `inline` - If a button in a standard button message (not `external`) has a type of `inline`, it will appear along with the button message text, inside the chat bubble.

{% hint style="success" %}
**Saves Message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen
{% endhint %}
