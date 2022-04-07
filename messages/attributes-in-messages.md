---
description: How to use attributes in message content to create custom experiences
---

# Attributes in Messages

Attributes can be used in any message to create dynamic text and content. For example, the user's name could be placed in a welcome message to create a more custom experience.

![Displaying the value of the first\_name attribute from the user context in a text message](<../.gitbook/assets/image (420) (1).png>)

### Notation

Attributes are added to messages using curly braces `{`,`}` and referencing the context name and attribute name separated with a period(`.`). For example, to display the `first_name` stored in the `user` context add the following in the mesage editor:

```
{ user.first_name}
```

When the message is selected and formatted, any attribute references in the message will be replaced with the value of the attribute in the given context.&#x20;

Note - If the attribute has no value or does not exist in the context given, the attribute reference is removed from the final message

### Attribute Filters

Sometimes it is nessecary to filter or modify the value of an attribute before it is used in a message. To help with this, OpenDialog provides a number of built in filters that can be used when referencing attributes in the message editor.

Filters are applied to attributes using a pipe (`|`) and they can be chained together with the result of 1 filter being passed through the next.  eg

```
{ user.age | number_to_words | uppercase_first }
```

The above would take the value of the `age` attribute in the `user` context, convert the number to words and then uppercase the first letter. If `age` was 30, the value placed in the message would be 'Thirty'

#### Available FIlters

**String filters**

* `uppercase` - uppercases all letters in the string
* `uppercase_words` - uppercases the first letter of each word in the string
* `uppercase_first` - uppercases only the first letter in the string
* `lowercase` - lowercases the entire string

**Number Filters**

* `number_to_words` - turns a number into its word. eg 1 => 'one'
* `ordinal` - returns the ordinal of the number. eg 1 => 1st
* `ordinal_words` - returns the ordinal spelled out. eg 1 => 'first'

**Collection Filters**

* `count` - returns the number of items in a collection type attribute

### Where attributes can be used

Attributes can be used in any message in place of text, button text, image source, form field text etc.&#x20;

![Example message content using attributes in various message types](<../.gitbook/assets/image (458) (1).png>)
