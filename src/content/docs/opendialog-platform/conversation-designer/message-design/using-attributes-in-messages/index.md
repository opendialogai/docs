---
title: Using Attributes in Messages
---

Attributes can be used in any message to customize the content. For example, the user's name can be added in the welcome message to personalize the experience.

![](/.gitbook/assets/2023-05-01_16-43-02.png)

*Edit Message screen*

### Notation

Attributes are added to messages using curly braces `{}` and inside the curly braces we first add the context name (very often and by default the context is "user"), next we add a period (`.`) and then the attribute name. For example, the attribute `first_name` stored in the `user` context looks like this:

```
{user.first_name}
```

If the value of `first_name` is John, the message will display as "Hello John and welcome back to Prime Brands."

Note - If the attribute has no value or does not exist in the context given, the attribute reference is removed from the final message.

### Message editor

![](</.gitbook/assets/Group 3 (1).png>)

*The attribute input field can be accessed within the message editor section of the conversation designer*

To access the Attribute Management feature within the message editor for a given scenario:

* Go to your workspace overview (Scenarios)
* Select the scenario you would like to update
* Select the message section under 'Design' in the left-hand menu
* Select the message you would like to edit
* Click within the 'Text' block for your chosen message
* Activate Attribute Management by inputting an opening curly brace `{`

:::note
For more information around using, creating and finding attributes within the message editor, follow this link to the[ Attribute Management](/core-concepts/contexts-and-attributes/attribute-management#message-editor) documentation
:::

### Attribute Filters

It may be necessary to filter or modify the value of an attribute before it is used in a message. To help with this, OpenDialog provides a number of built-in filters to use when referencing attributes in the message editor.

Filters are applied to attributes using a pipe (`|`) and they can be chained together with the result of a filter being passed through into the next filter. For instance:

```
{ user.age | number_to_words | uppercase_first }
```

The above takes the value of the `age` attribute in the `user` context, converts the number to words and adds an uppercase the first letter. If `age` was 30, the value placed in the message would be 'Thirty'.

:::note
For a complete list of available filters including string, number, date, collection, encoding, and cryptographic filters, see the [Attribute Filters](/core-concepts/contexts-and-attributes/attribute-filters) documentation.
:::

For video lessons and hands-on practice with these concepts, consider signing up for the OpenDialog Academy lessons by emailing academy@opendialog.ai.
