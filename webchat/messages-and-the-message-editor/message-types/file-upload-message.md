---
description: >-
  File upload messages allow us to submit more than one file at a time in
  multiple different formats.
---

# File Upload Message

## When to use file upload messages

Submitting documentation such as proof of address or identifying documents like driving licenses is made possible directly in the chat window with file upload messages.&#x20;

Parameters such as file type, file size and the number of files that can be uploaded are all defined by the designer.&#x20;

<div>

<figure><img src="../../../.gitbook/assets/Screenshot 2024-01-16 at 13.38.43 (1).png" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../../.gitbook/assets/Screenshot 2024-01-16 at 13.21.25 (1).png" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../../.gitbook/assets/Screenshot 2024-01-16 at 13.27.21 (1).png" alt=""><figcaption></figcaption></figure>

</div>

## How to create a file upload message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Copy the [XML snippet](file-upload-message.md#xml-snippet) at the bottom of this page into the black box and your chat message will appear in the Preview panel.&#x20;

Fill in the template with the [properties](file-upload-message.md#properties) of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

#### Properties

`<attribute_name>` The url to the host website where the uploaded files will be stored can be set here.

`<file_types>` List the extensions of the file types that you would like to accept in your uploader.

`<multiple>` is a boolean that turns the uploaders ability to take more than one file at a time on or off.

`<callback>`  As with button messages, the callback parameter defines the user intent that is triggered when the user clicks the submit button. This should route the user to the next step in the conversation.

`<submit_text>` defines the text that appears on the button that advances the conversation.

`<cancel_callback>`The cancel callback parameter defines the user intent that is triggered when the user clicks the cancel button.&#x20;

`<cancel_text>`defines the text that appears on the button that cancels the file upload step.

`<file_size>`   The file size here is measures in bytes. So 11000 bytes equal 11KB.

#### XML Snippet

```
<file-upload-message>
  <text>Text</text>
  <attribute_name>Attribute Name</attribute_name>
  <file_types>
    <option>pdf</option>
    <option>doc</option>
    <option>txt</option>
  </file_types>
  <multiple>true</multiple>
  <callback>Callback</callback>
  <submit_text>Submit Text</submit_text>
  <cancel_callback>Cancel Callback</cancel_callback>
  <cancel_text>Cancel Text</cancel_text>
  <file_size>11000</file_size>
</file-upload-message>
```

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}
