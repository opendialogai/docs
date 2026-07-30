---
title: Using Markdown in messages
---

In order to add richness and enhance our end users' experience when using the WebChat interface, it is possible to use Markdown within message types that have a significant text component. The currently supported message types are: Text, Button, Form and Rich. OpenDialog supports all the [basic features](https://www.markdownguide.org/basic-syntax/#overview) of the Markdown syntax, as well as [tables](https://www.markdownguide.org/extended-syntax/#tables) and [fenced code blocks](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks).

![](</.gitbook/assets/image (571).png>)

*You can add your Markdown formatted content directly in the message editor*

### Adding custom attributes to your Markdown

In addition to providing Markdown support, OpenDialog also supports the use of Markdown attributes within WebChat. This allows designers to add their own classes and IDs to elements within the message content so that they can be styled later using external CSS. To avoid any security concerns, only a limited set of HTML attributes will be accepted; these are:

```
class, id, rel, role, title
```

To specify a custom class & ID for an element, use the following syntax:

```html
## How to change your email address. [[.header--green #header]]

// output
<h2 id="header" class="header--green">How to change your email address.</h2>
```

For classes and IDs, use  `.` and `#`  respectively, for the other supported attributes you can use the following syntax:

```
[[title="my amazing title"]]
```

Occasionally there may be some ambiguity over which element the attribute should be applied to. In the case of the list below for example, we can solve this using the placement of the attribute markdown:

```markdown
- list item **bold**[[.red]]

// output
<ul>
    <li>list item <strong class="red">bold</strong></li> // the class is applied to the <strong> element
<ul>

- list item **bold** [[.red]]

// output
<ul>
    <li class="red">list item <strong>bold</strong></li> // adding a space applies the class to the <li>
</ul>

- list item **bold**
[[.red]]

// output
<ul class="red"> // putting the attribute markdown on a new line applies the class to the wrapping element
    <li>list item <strong>bold</strong></li>
</ul>

- item
  - nested item [[.a]]
[[.b]]

[[.c]]

// output
<ul class="c">
  <li>item
    <ul class="b">
      <li class="a">nested item</li>
    </ul>
  </li>
</ul>

```

For more information, you can check out the [documentation here](https://www.npmjs.com/package/markdown-it-attrs), but be aware that in OpenDialog we use `[[ ]]` to denote an attribute, NOT `{ }` as used in the above link.

### Syntax highlighting

WebChat will add syntax highlighting to fenced code blocks so that code examples are easier to read for users. If no language is supplied, it will attempt to detect the language and highlight appropriately, however you can also specify the language using the following syntax (note the language name at the end of the first 'fence'):

````markdown
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
````
