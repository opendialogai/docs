---
description: This page describes where to use and find a full page message type
---

# Full Page Message

## What is a full page message?

When full page messages are received, they will take over the entire chatbot screen (depending on what is supported by each platform)

Rich and Form messages can also be presented as 'full page' messages. When full page messages are received, they will take over the entire chatbot screen (depending on what is supported by each platform). For webchat full page messages, the user input is also taken over.

Full page rich messages are defined in exactly the same way as standard rich messages.

Full Page Form messages are defined in exactly the same way as form messages, but with a different element name.

Optionally, the full page form message can contain a cancel button. This allows the user to tell the bot they do not want to submit the form. When clicked, the value of `cancel_callback` is sent.&#x20;

## When to use full page messages

Full page messages are best used when you have a rich or form message that is the main focus, and that needs the users full attention. Using a full page message means that you'll be able to make sure that all the users attention is on that message block.

## How to create a full page message

### Via the custom message in Message Editor - rich message

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `fp-rich-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](full-page-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../../.gitbook/assets/Group 12.png" alt=""><figcaption><p>How to create a full page rich message in the custom message editor</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'fp-rich-message' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

### Via the custom message in Message Editor - form message

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `fp-form-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](full-page-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../../.gitbook/assets/Group 13.png" alt=""><figcaption><p>How to create a full page form message in the custom message editor</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'fp-form-message' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

Full page rich message

```xml
<fp-rich-message>

-- THIS MUST BE THE LAST MESSAGE IN THE LIST TO WORK AS EXPECTED -->
  <title>Rich Message</title>
  <subtitle>With a subtitle</subtitle>
  <text>Some engaging text</text>
  <image>
    <src>https://gblobscdn.gitbook.com/spaces%2F-MOzV9Wk3YsltjoDUyen%2Favatar-1608658264352.png?alt=media</src>
    <url new_tab="true">https://docs.opendialog.ai</url>
  </image>
</fp-rich-message>
```

Full page form message

```xml
<fp-form-message>

-- THIS MUST BE THE LAST MESSAGE IN THE LIST TO WORK AS EXPECTED -->
  <text>Text</text>
  <submit_text>Submit Text</submit_text>
  <callback>Callback</callback>
  <auto_submit>false</auto_submit>

  <element>
    <element_type>select</element_type>
    <name>title</name>
    <display>Title</display>
    <options>
      <option>
        <key>mr</key>
        <value>Mr.</value>
      </option>
      <option>
        <key>mrs</key>
        <value>Mrs.</value>
      </option>
      <option>
        <key>other</key>
        <value>Other</value>
      </option>
    </options>
  </element>

  <element>
    <element_type>text</element_type>
    <name>name</name>
    <display>Name</display>
  </element>

</fp-form-message
```

The cancel button can be added to a form message with the following mark up:

```xml
    <fp-form-message>
       <text>Text</text>
       <submit_text>Submit Text</submit_text>
       <callback>Callback</callback>
       <auto_submit>true|false</auto_submit>
       <cancel_text>Text</cancel_text>
       <cancel_callback>Callback</cancel_callback>
    </fp-form-message>
```

## How to use a full page message

## How to construct a full page message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structuring these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
