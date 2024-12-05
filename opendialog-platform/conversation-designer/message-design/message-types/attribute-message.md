---
description: This page describes when to use and find an attribute message type
---

# Attribute Message

### What is an attribute message? <a href="#what-is-a-list-message" id="what-is-a-list-message"></a>

Attribute message allows you to define message structure at runtime during the conversation rather than design time.

### When to use attribute message <a href="#what-is-a-list-message" id="what-is-a-list-message"></a>

You want to use attribute message when you don't know exact message structure when designing your conversation. This is typically happens when you need to retrieve data for your message structure  from external services or as a result of action.&#x20;

### How to create attribute message <a href="#what-is-a-list-message" id="what-is-a-list-message"></a>

Navigate to the [Message Editor](https://docs.opendialog.ai/~/changes/BlkAxgfqkBZsmUnZLd8K/opendialog-platform/conversation-designer/message-design/message-editor) and create a _Custom Message._ Copy the [XML snippet](attribute-message.md#what-is-a-list-message-3) at the bottom of this page into the black box, or select `attribute-message` from the dropdown.

<figure><img src="../../../../.gitbook/assets/image (4).png" alt=""><figcaption><p>How to create an attribute message in custom message block</p></figcaption></figure>

#### XML Snippet <a href="#what-is-a-list-message" id="what-is-a-list-message"></a>

```xml
<attribute-message>context_name.attribute_name</attribute-message>
```

`context_name` - name of a [context](../../../../core-concepts/contexts-and-attributes/contexts.md) where to look for an attribute followed by dot `.` If context is omitted then conversation engine will assume `user` context.

`attribute_name` - attribute which contains XML definition of a messages.

{% hint style="warning" %}
Pay attention that you do not need to use attribute syntax here (with curly braces `{attribute}`) to specify which attribute you want to use.&#x20;
{% endhint %}

#### Content of an attribute

Attribute which you will use to construct your attribute message must be in a specific format:

```xml
<message disable_text="{true|false}" hide_avatar="{true|false}">
    ...XML definition of messages you want to display...
</message>
```

1. Root element must be `message` with attributes `disable_text` and `hide_avatar` specifying whether you want these to be true or false
2. In child elements you put XML definition of any other message(s) that OpenDialog supports. Below you can find examples of what it might be.

**Text message**

```xml
<message disable_text="false" hide_avatar="false">
    <text-message>Here is text message</text-message>
</message>
```

**Rich message followed by text message**

```xml
<message disable_text="false" hide_avatar="false">
  <rich-message>
    <title>Rich Message</title>
    <subtitle>With a subtitle</subtitle>
    <text>Here is rich message followed by text message</text>
  </rich-message>

  <text-message>Here is text message</text-message>
</message>
```

**Image message followed by list message followed by button message**

```xml
<message disable_text="false" hide_avatar="false">
  <image-message> 
    <src>https://opendialog.ai/wp-content/uploads/2021/03/Dark-Logo-Side-by-Side@2x-300x72-1-e1615372542577.png</src>
    <url new_tab="true">https://opendialog.ai</url>
  </image-message>

  <list-message>
    <item><text-message>Text message list item1</text-message></item>
    <item><text-message>Text message list item2</text-message></item>
  </list-message>

  <button-message>
    <text>A bit of explainer text at the top</text>
    <button> 
      <text>Button text</text>
      <callback>intent.app.startAConversations</callback>
    </button>
  </button-message>
</message>
```



### How to use attribute message <a href="#what-is-a-list-message" id="what-is-a-list-message"></a>

Attribute messages really shines when you need to construct your message dynamically. Let's walk through some examples.

#### Example 1. You want to display list of items retrieved from API

TBD

#### Example 2. You want to process list of items from user input

TBD



