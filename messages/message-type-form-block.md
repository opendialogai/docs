---
description: Form message type
---

# Message type: Form block

The form message lets you create more complicated message inputs that are great for capturing structured information about the user use as addresses or full names.

You can only add one form message type to each message, and it should be the last message in the list to work properly.&#x20;

![Example form message with address fields](<../.gitbook/assets/image (419).png>)

### Properties

Each form message has the follow properties:

* **Text**: Form text can optionally be set and will be displayed at the top of the form message if set
* **Button text**: The text to display on the submit button shown at the bottom of the form message.
* **Callback**: Similarly to the 'simulate user intent' button messages, this field needs to be set to point to the next intent in the conversation flow. When clicked on, a list of all conversations for the current scenario is show listing each intent that is part of them. Either select the corret user intent, or create a new one using the drop down interface. See [button message](https://docs.opendialog.ai/messages/message-type-button-block#button-functionality) for more info

Each form messagee can have as many fields as needed to capture the information required. There are 4 main types of form fields:

* Short text
  * Short text fields have 3 sub-types that control what information can be entered in the field: `alphanumeric`, `numeric` or `email`. `email` types will be validated before submission
* Long text
* Dropdown
* Checkbox&#x20;

![Adding a new form field to a form message](<../.gitbook/assets/image (448).png>)

Each form field must specify:

* Field Label. This is what is displayed next to the input in the message. It can be left blank to not display anything
* Field options (for drop down and checkbox types only). What options to present to the user in the select drop down or checkbox list
* Attribute name. You must specify the name of the attribute that the value entered will be saved against. By default, the attribute will be saved to the user context when the form is submitted
* Default value. If set, the form field will be pre-populated with this value. It can either be a hard-coded value, or it can use OpenDialogs attribute filling system to take the value of an attribute from a context. Eg `{user.first_name}` will user the value of the `first_name` attrbute from the `user` context
* Optional field. If not set, the field must have a value set before the form can be submitted
