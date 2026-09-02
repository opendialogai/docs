---
title: Form Message
description: This page describes where to use and find a form block message type
---

## What is a form message?

The form message lets you create more complicated message inputs that are great for capturing structured information about the user use as addresses or full names.

Each form message has the follow properties:

* **Text**: Form text can optionally be set and will be displayed at the top of the form message if set
* **Button text**: The text to display on the submit button shown at the bottom of the form message.
* **Callback**: Similarly to the 'simulate user intent' button messages, this field needs to be set to point to the next intent in the conversation flow. When clicked on, a list of all conversations for the current scenario is show listing each intent that is part of them. Either select the correct user intent, or create a new one using the drop down interface. See [button message](https://docs.opendialog.ai/messages/message-type-button-block#button-functionality) for more info
* **Validation:** When creating your form message, you can also set validation for your input fields. There are two ways you can do this, through the regular expression for validation field, and through the error text for use with regular expression validation field. Both of these are optional, but are there if you wish to use them

Each form message can have as many fields as needed to capture the information required.

## When to use a form message

There are many different situations in which a form message would be used within an OpenDialog chatbot. For example, user registration. If you require your users to input their information, it is much easier to do this through having them fill out a form, rather than manually input all their text.

## How to create a form message

### Via the no-code image message in Message Editor

Navigate to the [Message Editor](/opendialog-platform/conversation-designer/message-design/message-editor) and create a form block by clicking the _Add form block_ icon in the Layout section.

![](~/assets/group-10-2.png)

*How to create a form message in the no-code form message block*

### Creating Form Messages With Dynamic Data

When creating a form message in the Message Editor, there are two ways to provide dropdown options. The first, is by manually providing a set of static options. The second way to do this is via a [collection attribute](/core-concepts/contexts-and-attributes/about-attributes#multiple-value-attribute-types-collections-and-composites), populated by a fetch operation from a [webhook action](/opendialog-platform/actions/webhook-action).

By clicking on _-Select-_, you can choose how you want to populate your dropdown.

![](~/assets/image-590.png)

*Deciding how to populate your form message dropdown*

If you decide to do this manually, you can simply type the name of the option, and hit the '+' button to add the option. Your options will appear underneath the input box, and also in the preview tab on the right hand side.

![](~/assets/image-592.png)

*Adding static options to your FormMessage dropdown*

![](~/assets/image-593.png)

*Adding dynamic data to FormMessage dropdown*

If you want to use a collection attribute, you can select what context that attribute will be saved in, and then specify the name of that attribute so that during a live conversation (you can test this in preview or on a live bot) the options are dynamically filled.

We support a range of attribute types from the following list:

* `StringCollectionAttribute` e.g. \["Banana", "Apple", "Cherry"]
* `IntegerColelctionAttribute` e.g. \[1, 2, 3]
* `FloatCollectionAttribute` e.g. \[1.1, 1.2, 1.3]
* `ArrayDataAttribute` (aka 'List') e.g. \["Any set of values", "that you like", \["even nested ones"]]
* `JSONInferredCompositeAttribute` e.g. { "1": "Unemployed", "2": "Employed"}

The only unsupported type is:

* `CompositeCollectionAttribute`

**Key/Value Mapping**: For large option sets, use `JSONInferredCompositeAttribute` to show user-friendly labels while storing corresponding IDs or codes. Users see the "value" (e.g., "Software Engineer") but your system stores the "key" (e.g., "SE001").

![An image of the Form Select Designer. From Top to bottom we have 6  input fields with the following labels: &#x27;Field type&#x27;, &#x27;Field label&#x27;, &#x27;Select a data source&#x27;, &#x27;Attribute name&#x27; and &#x27;Default value&#x27;. There is also a checkbox beneath that toggles if the field is optional (default setting) or mandatory.](~/assets/image-594.png)

Once you've specified your data or data source, you will see a toggle to enable sorting of your dropdown options. When enabled, they will be alphabetically sorted from A-Z (A at the top, Z at the bottom) to make it simpler to scroll through the different options, or jump to a specific start letter.

### Searching Within A Dropdown In WebChat

Once your form message is built, testing it in preview will show the form and let you type to search. You can search a form select regardless of the number of options within it.

![](~/assets/image-596.png)

*Searching a dropdown in a form message*

If you choose to sort your options alphabetically, users will be provided with a navigation bar to jump to a specific letter.

**Priority Options**: Symbols, numbers, and special characters sort to the top—prefix important options with "\*" or other characters to keep them visible at the start of the list.

![](~/assets/image-595.png)

*Sorting your options alphabetically, including priority options*

### Via the custom message in Message Editor

Navigate to the [Message Editor](/opendialog-platform/conversation-designer/message-design/message-editor) and create a _Custom Message._ Select `form-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](/opendialog-platform/conversation-designer/message-design/message-types/form-message#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.

![](~/assets/group-11-1.png)

*How to create a form message in the custom message block*

:::tip
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Form message' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
:::

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
    <options_attribute>context.attribute_name</options_attribute>
    <alphabetical>false</alphabetical>
</element>
```

For a `select` element, you can also define an `options_attribute` , by providing the context name (e.g. user, session, conversation, etc...) and the name of the attribute you want to use, separated by a dot ("."). This is a way of populating the `options` block with a dynamic data source.

Additionally, we have an `<alphabetical></alphabetical>` tag to control whether the dropdown options are sorted alphabetically A-Z or not. This defaults to a value of `false`.

The `email` element type acts just like a `text` element, but on submission, is validated to ensure it is formatted like an email address

![](~/assets/image-21.png)

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

<figure class="od-embed">
<div class="od-embed-frame">
<iframe src="https://www.loom.com/embed/d83919130d5743b5a9bc7b3763bdf62c" title="A video example of how to use a form message" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<figcaption>A video example of how to use a form message</figcaption>
</figure>

:::tip
**Saves Message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen
:::

## How to retrieve uploaded data?

When a user fills out your form, you may be wondering where that data is kept/stored for you to be able to have access to.

When your user fills out your form, all of their information is added to the User Context. Each field that is available to fill out has an attribute. This means, that once the information is added, it is then added to that attribute for you to use and reference throughout the rest of your conversation. For more information on how to use and create attributes, click [here](/core-concepts/contexts-and-attributes/attribute-management).

## How to construct a form message?

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structuring these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](/opendialog-platform/conversation-designer/message-design/constructing-messages)page for more information.

You can only add one form message type to each message, and it should be the last message in the list to work properly.

:::note
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](/opendialog-platform/conversation-designer/designing-accessible-chatbots).
:::

## Making Form Messages Expandable

Form messages support expandable attributes for cases where you have lengthy form introductions or many fields.

### Expandable Attributes

| Attribute                   | Description                                       | Required                                  |
| --------------------------- | ------------------------------------------------- | ----------------------------------------- |
| `expandable-text`           | Set to `"true"` to enable text expansion          | Yes (to enable)                           |
| `expandable-text-height`    | Visual height for collapsed text                  | One of height OR chars required           |
| `expandable-text-chars`     | Character limit for collapsed text                | One of height OR chars required           |
| `expandable-message`        | Set to `"true"` to enable whole message expansion | Yes (to enable message expand)            |
| `expandable-message-height` | Visual height for collapsed message               | Required when `expandable-message="true"` |

### Best Practices

* Use cautiously with forms - users need to see fields to complete them
* If using message expand, show at least the first 2 form fields when collapsed
* Consider whether expansion improves or hinders the form-filling experience
