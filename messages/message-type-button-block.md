---
description: Button message type
---

# Message type: Button block

The button message type allows you to create button driven applications like [this tutorial \(Designing a basic flow and controlling with buttons\).](../tutorials/button-driven-bot.md) 

You can add only one button message type to each message, however, within that you can add as many buttons as you require. You can do this by clicking on the + next to the message you require the button to appear afterwards. Right now you can not reorder the buttons, so they need to be added in the right order. 

![Message editor: Button message type](../.gitbook/assets/image%20%28288%29.png)

Within the button block, you can add some plain text \(_if you've not already used the text block_\) and then edit/add new buttons. Within each button you can add:

* **Button text:** This is the text that is visible on the button
* **Button functionality:** This is the action that you would like the button to perform e.g. open an external URL or transition the user to another intent \(you'll have seen this in the [Designing a basic flow and controlling with buttons tutorial](../tutorials/button-driven-bot.md)\). 

![Button functionality: Options](../.gitbook/assets/image%20%28294%29.png)

### **Button functionality**

Let's focus on transitioning to another intent _\(Simulate user intent\)_ as this action will likely be what you'll be wanting to perform most. There are two options here, either; locate an intent that you've already created from the drop-down or create a new intent. 

![Message editor: Simulate user intent](../.gitbook/assets/image%20%28292%29.png)

To create a new one, you need to open the Conversation where the new intent needs to be located, click on 'Create new intent...' and then add the name and finally select the Scene then Turn it should live in \(you can also create Scenes and Turns if required\). Remember to click on ✔ to save before closing.

![Message editor: Create new intent.](../.gitbook/assets/image%20%28314%29.png)

### **Button behaviours**

For the button message type, you can select a number of advanced behaviours depending on your use case.

* **Override user input field - show buttons as main interaction mode:** This option will hide the text input within webchat and show the buttons as the main interaction.
* **Allow continued interaction throughout the conversation:** This option will allow users to continue to interact with the buttons even if they have moved on from that part of the conversation. This is really useful for FAQ chatbots. 

