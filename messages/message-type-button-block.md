---
description: Button message type
---

# Message type: Button block

The button message enables you to create button driven applications like [this tutorial (Designing a basic flow and controlling with buttons).](broken-reference)&#x20;

You can add only one button message type to each message, however, within that you can add as many different buttons as you require. You can do this by clicking on the ＋ next to the button entry you require the button to appear afterwards. Right now you can not reorder the buttons, so they need to be added in the order you want them to appear.

![Message editor: Button message type](<../.gitbook/assets/image (290).png>)

Within the button block, you can add some plain text (_if you've not already used the text block_) and then edit/add new buttons. Within each button you can add:

* **Button text:** This is the text that is visible on the button
* **Button functionality:** This is the action that you would like the button to perform on click e.g. open an external URL or transition the user to another intent (you'll have seen this in the [Designing a basic flow and controlling with buttons tutorial](broken-reference)).&#x20;

![Button functionality: Options](<../.gitbook/assets/image (294).png>)

### **Button functionality**

Let's focus on transitioning to another intent _(Simulate user intent)_ as this action will likely be what you'll be wanting to perform most. There are two options here, either; locate an intent that you've already created from the drop-down or create a new intent.&#x20;

![Message editor: Simulate user intent](<../.gitbook/assets/image (292).png>)

To create a new one, you need to open the Conversation where the new intent needs to be located, click on 'Create new intent...' and then add the name and finally select the Scene then Turn it should live in (you can also create Scenes and Turns if required). Remember to click on ✔ to save before closing.

![Message editor: Create new intent.](<../.gitbook/assets/image (325).png>)

{% hint style="info" %}
**Reminder:** If you've created a new intent etc. Remember to go back into the Designer after you've saved the message to fine tune the settings of your new Intent, Scene and Turn. You will need to add behaviours, conditions and/or transitions.
{% endhint %}

### Button Values

Button messages also allow values to be assigned to each button so as well as simulating a user intent, they can assign a value to an attribute that can be saved against the user. \
\
For example, if a button message was created to allow a user to answer a question, 2 buttons could be added, 1 with a value of `yes` and one for `no`. The value can then later be used in conditions or actions to affect the conversation flow.&#x20;

#### Adding Button Values

Button values are added in the `Advanced settings` dropdown for buttons with the 'Simulate user intent' type behaviour selected in the 'Button functionality' drop down. The example given below will create a button message with 2 buttons - both will simulate the `AgeResponse` user intent, but each will save a different value against the `over18` attribute.

When a user clicks a button, by default the value will be saved to the user context for use later (_this can be altered by modifying an_ [_intent's advanced settings_](../turns-and-intents.md#advanced-settings))

![Adding button values through the message editor](<../.gitbook/assets/image (451) (1).png>)

### **Button behaviours**

For the button message type, you can select a number of advanced behaviours depending on your use case.

* **Override user input field - show buttons as main interaction mode:** This option will hide the text input within Webchat and show the buttons as the main interaction at the bottom.
* **Allow continued interaction throughout the conversation:** This option will allow users to continue to interact with the buttons even if they have moved on from that part of the conversation. This is really useful for FAQ style chatbots.

{% hint style="success" %}
**Saves Message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen
{% endhint %}
