---
description: This page describes where to use and find a form block message type
---

# Form Message

## What is a form message?

The form message lets you create more complicated message inputs that are great for capturing structured information about the user use as addresses or full names.

Each form message has the follow properties:

* **Text**: Form text can optionally be set and will be displayed at the top of the form message if set
* **Button text**: The text to display on the submit button shown at the bottom of the form message.
* **Callback**: Similarly to the 'simulate user intent' button messages, this field needs to be set to point to the next intent in the conversation flow. When clicked on, a list of all conversations for the current scenario is show listing each intent that is part of them. Either select the correct user intent, or create a new one using the drop down interface. See [button message](https://docs.opendialog.ai/messages/message-type-button-block#button-functionality) for more info
* **Validation:** When creating your form message, you can also set validation for your input fields. There are two ways you can do this, through the regular expression for validation field, and through the error text for use with regular expression validation field. Both of these are optional, but are there if you wish to use them

Each form message can have as many fields as needed to capture the information required.&#x20;

## When to use a form message

There are many different situations in which a form message would be used within an OpenDialog chatbot. For example,  user registration. If you require your users to input their information, it is much easier to do this through having them fill out a form, rather than manually input all their text.

## How to create a form message

### Via the no-code image message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a form block by clicking the _Add form block_ icon in the Layout section. &#x20;

<figure><img src="../../../../.gitbook/assets/Group 10 (2).png" alt=""><figcaption><p>How to create a form message in the no-code form message block</p></figcaption></figure>

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `form-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](form-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../../.gitbook/assets/Group 11 (1).png" alt=""><figcaption><p>How to create a form message in the custom message block</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Form message' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

Form messages allow for user to input data in standard web form rather than text entry. When submitted, the values entered by the user are sent back along with the defined `callback`. All form messages must contain the following elements:

```
    <form-message>
       <text>Text</text>
       <submit_text>Submit Text</submit_text>
       <callback>Callback</callback>
       <auto_submit>true|false</auto_submit>
    </form-message>
```

Here, the `text` value is shown at the top of the form message and the `submit_text` value is shown on the form submit button. When `auto_submit` is set to true, the form will automatically be submitted when the user selects a value. This works best when just 1 element is added to the form

**Elements**

Form messages have support for a number of different elements (matching what is possible in a standard HTML form). All elements are defined in the same way, and there is no limit to how many can appear on a form message.

Each element must define a `type` and `display`, and can optionally define `required` and `default_value`. If required is set to true, the form cannot be submitted unless the field has a value.

```
<element>
    <element_type>textarea|text|number|email|select|auto_complete_select|checkbox</element_type>
    <display>Display Name</display>
    <required>true|false</required>
    <default_value>Default Value</default_value>
</element>
```

When using `checkbox` or `select` elements, you must define an `options` block giving the options to be presented in the checkbox list or select element:

```
<element>
    <options>
      <option>
        <key>Key</key>
        <value>Value</value>
      </option>
    </options>
</element>
```

The `email` element type acts just like a `text` element, but on submission, is validated to ensure it is formatted like an email address

![](<../../../../.gitbook/assets/image (21).png>)

This form message example was created with the following XML:

```
<message>
    <form-message>
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

    </form-message>
</message>
```

## How to use a form message?

{% embed url="https://www.loom.com/share/d83919130d5743b5a9bc7b3763bdf62c?sid=be885a0c-4e12-476a-99d4-0c48cd036407" %}
A video example of how to use a form message
{% endembed %}

{% hint style="success" %}
**Saves Message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen
{% endhint %}

## How to retrieve uploaded data?

When a user fills out your form, you may be wondering where that data is kept/stored for you to be able to have access to.

When your user fills out your form, all of their information is added to the User Context. Each field that is available to fill out has an attribute. This means, that once the information is added, it is then added to that attribute for you to use and reference throughout the rest of your conversation. For more information on how to use and create attributes, click [here](../../../../core-concepts/contexts-and-attributes/attribute-management.md).

## How to construct a form message?

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structuring these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

You can only add one form message type to each message, and it should be the last message in the list to work properly.&#x20;

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

