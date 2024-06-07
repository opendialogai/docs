---
description: This page describes where to use and find a file upload block message type
---

# File Upload Message

## What is a file upload message?

File upload messages allow us to submit more than one file at a time in multiple different formats.

## When to use file upload messages

File upload messages are best used when submitting documentation such as proof of address or identifying documents like driving licenses is made possible directly in the chat window with file upload messages.&#x20;

Parameters such as file type, file size and the number of files that can be uploaded are all defined by the designer.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2024-06-04 at 11.03.22.png" alt="" width="185"><figcaption><p>An example of a file upload message in use</p></figcaption></figure>

## How to create a file upload message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Copy the [XML snippet](file-upload-message.md#xml-snippet) at the bottom of this page into the black box and your chat message will appear in the Preview panel.&#x20;

Fill in the template with the [properties](file-upload-message.md#properties) of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Group 18.png" alt=""><figcaption><p>How to create a file upload message in the custom message block</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'file upload' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

```
 <file-upload-message>
    <callback>Continue</callback>
    <submit_text>Submit</submit_text>
    <cancel_callback>Cancel Callback</cancel_callback>
    <cancel_text>Cancel</cancel_text>
    <error_callback>Error Callback</error_callback>
    <multiple>false</multiple>
    <file_size>500000</file_size>
    <file_types>
       <option>jpg</option>
       <option>png</option>
       <option>gif</option>
    </file_types>
    <base_path>your/file/path</base_path>
    <attribute_name>date_attribute</attribute_name>
 </file-upload-message>
```

#### Properties

`<attribute_name>` The url to the host website where the uploaded files will be stored can be set here.

`<file_types>` List the extensions of the file types that you would like to accept in your uploader.

`<callback>`  As with button messages, the callback parameter defines the user intent that is triggered when the user clicks the submit button. This should route the user to the next step in the conversation.

`<multiple>` is a boolean that turns the uploaders ability to take more than one file at a time on or off.

`<submit_text>` defines the text that appears on the button that advances the conversation.

`<cancel_callback>`The cancel callback parameter defines the user intent that is triggered when the user clicks the cancel button.&#x20;

`<cancel_text>`defines the text that appears on the button that cancels the file upload step.

`<file_size>`   The file size here is measures in bytes. So 11000 bytes equal 11KB.

`<base_path>` Your file path

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

## How to use a file upload message

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to retrieve uploaded files

All files will be uploaded physically to `Amazon S3 Service`

\
`FileUploadMessage` `attribute_name` should be a name of already registered attribute of type `FileCollectionAttribute`. The application registers a default&#x20;

`FileCollectionAttribute` that is called `file_upload` and the `FileUploadMessage` uses that by default. Users can use Create Attribute Modal or `admin/dynamic-attributes` page to create additional `FileCollectionAttribute` and use that in the `FileUploadMessage`.

\
`File Collection` is a `Composite Collection` attribute and currently it contains following properties:\
`name` - the name of the file\
`size` - the size of the file\
`type` - the type of the uploaded file\
`url` - this is a temporary URL to access the uploaded file. By default this link will last 30 minutes. After that time it won't be accessible any more.

\
The properties of the `File Collection` attribute can be accessed using indexes. If the name of the attribute is `file_upload`, then something like this:\
`file_upload[0]['name']`\
`file_upload[0]['size']`\
`file_upload[0]['type']`\
`file_upload[0]['url']`

## How to construct a file upload message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
