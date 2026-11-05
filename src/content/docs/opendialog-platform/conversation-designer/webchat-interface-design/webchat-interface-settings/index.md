---
title: Webchat Interface Settings
description: Customise the look and feel of the Webchat widget
---

The Interface Settings section of the OpenDialog admin is where you go to customise how the widget looks and behaves before [embedding](/developing-with-opendialog/webchat/load-webchat-within-a-page-element) it on your webpage.

The settings are per scenario: each scenario has its own interface settings, and changes only affect the scenario you are editing, including if it has already been published. Any changes saved are instantly applied and anyone using your bot going forward will see them. You can use the preview section to test out the widget and see how.

Any changes made to the fields are not saved until you click on the 'Save Settings' button at the top of the screen

![](~/assets/image-583.png)

*Save your settings changes using the save button*

## Interface Settings

The settings are broadly split into 4 settings that affect different elements within the interface and how it behaves.

### General

![The General settings](~/assets/screenshot-2024-11-29-at-14-07-49.png)

Here you can configure some overall settings for the widget:

**Header** - Control the chatbot logo that appear in the header. If no value is set, nothing is shown.

**Chatbot** - Controls the global name and avatar used for the messages from the chatbot. The avatar can be turned off for individual messages in the message editor.

**Messages** - Toggle whether the time of the message is shown underneath each message.

**Typing Event** - Controls behavior when bot "typing" a response. \
\- _Timing_ configures the length of time (in milliseconds) that the typing indicator should be shown for each message.\
\- You can control whether you want to show the typing indicator between each message block in the individual message toggling option _Hide Typing Indicator between messages_.\
\- _Show the typing indicator on message send_ controls whether to show the typing indicator at all.\
\- _Typing Indicator_ can be either "Animation", which will show three dancing dots (![](~/assets/image-2-4.png)), or "Animation with feedback text", which will show spinning dots with feedback text (![](~/assets/image-3-3.png))

You can configure the text and color of dots for "Animation with feedback text" in the embed code after you publish your scenario. Add the general key to your window.openDialogSettings object with the property typingIndicatorSettings. For this, you would need to specify:

\- `color` - hex value for the desired color of spinning dots;\
\- `texts` - array of strings containing phrases which will rotate with a 3-second interval. The last phrase will stay as long as it takes the bot to respond.

```html
<script>
  window.openDialogSettings = {
    url: 'https://....',
    appKey: '.....',
    general: {
      typingIndicatorSettings: {
        color: '#ffaa35',
        texts: ['Thinking...', 'Collecting data...', 'Typing...']
      }
    },
    ...
  };
</script>
```



**Chatbot Controls** - Controls whether various buttons are displayed on the chatbot. The download button allows the user to download a text copy of the chat log. [More info on restart and end chat can be found here](/opendialog-platform/conversation-designer/conversation-design/conversational-patterns/building-robust-assistants/contextual-restart-chat-end)

**Start Options** - When a chat session starts, the widget works out whether we are dealing with a new user (someone we have never seen before), a returning user (someone who we have seen before but is not in a conversation) or an ongoing user (a user we have seen before who is in a  conversation). These options allow you to chose if the widget should start minimised and less intrusive for any of these user types.

### CSS

![CSS Options](~/assets/image-55.png)

Here you can upload custom CSS files to completely customise the chat widget. There are 2 files you can add:

**CSS for Chatbot** - This will be loaded inside the chat widget and is used to alter things about the widget

**CSS for page -** This is loaded on the parent page that the widget is on. This allows for customisation of things like size and position of the widget

### Layout Settings

![Alter the colours used in the bot](~/assets/image-285.png)

Here you can adjust the colours used in the bot from the chat window itself to the messages and buttons.

:::caution
**Remember:** Please ensure that the colours you pick are compatible with each other and content will be readable
:::

### Conversational History Settings

![Adjust what history is shown to the user](~/assets/image-528.png)

Here, you can control whether the interface shows a user their previous chat history on load, and if so, how many messages to show. You can test how this behaves by using the preview section and **refreshing** the page on your browser rather than clicking the 'Refresh Scenario' button as this will generate a new user.

## Security Settings

![](~/assets/image-578.png)

*Security Settings tab*

### Anonymous Authentication

![](~/assets/image-579.png)

*Anonymous Authentication*

Anonymous Authentication is designed to enhance security while allowing users to interact without traditional login credentials. By default, this will be enabled when you create a new scenario.

When a user first interacts with the system, it checks if the user ID already exists. If not, a secure token (JWT) is created as a cookie to verify their identity, securely stored, and linked to the user. On future visits, the system uses this token to recognise the user and maintain their session.

This authentication method applies to sending messages, retrieving configuration settings, viewing past conversations, and accessing chat transcripts. It helps prevent unauthorised users from accessing protected chat features.

When this feature is enabled, users must not be assigned pre-set user ID's (such as email addresses) as Anonymous Authentication requires user IDs to be assigned as random and unique identifiers, so that they are not predictable.

### Cross site request forgery (CSRF)

![](~/assets/image-581.png)

*Cross Site Request Forgery Settings*

In order to protect the Anonymous Authentication cookie, and to prevent data manipulation, an anti-CSRF token can be automatically applied to all webchat requests. The token will be issued as a cookie, and each request will return the token as a HTTP header. The cookie will only be readable by a page of the same origin which ensures that it can not be sent as a header by untrusted pages.

This means that SDK implementations will need to ensure that the a custom subdomain is registered which can be mapped to the OpenDialog ChatAPI. Without this the cookie will not be readable by your page (as the ChatAPI is considered a 3rd party). While developing your SDK implementation, the CSRF Interface Setting can be toggled off to allow you to continue building while a custom domain is provisioned.

### Cross origin resource sharing (CORS)

![](~/assets/image-582.png)

*Cross Origin Resource Sharing Settings*

CORS settings can be enabled to only allow specific websites to display your webchat agent. This is enforced by CORS headers which are respected by all major browsers.

After enabling CORS, you will need to provide a list of the origins that should be allowed. This should include the protocol and the domain, such as `https://example.com`.

### Sensitive data redaction

![](~/assets/sensitive-data-redaction-settings.png)

*Sensitive Data Redaction settings*

Users sometimes type things into the chat that you don't want to keep, such as a card number or a social security number. Sensitive data redaction masks that data before the message is stored or processed, so anything your rules match never reaches your conversation logs, your attributes or any language model. It only catches what your rules describe: sensitive data that doesn't match a rule, or is written in a format the rule doesn't recognise, is not masked.

Redaction is off by default. Turn on **Redact sensitive data in user messages** to switch it on for the scenario.

Redaction happens in two places:

* **In the chat window.** The message is masked before it is sent, so the user sees it redacted straight away in their own transcript.
* **On the OpenDialog server.** The same rules run again when the message arrives, as a backup for anything that skipped the chat window, such as messages sent through the SDK.

Masking replaces each letter and digit in the match with the replacement character, and keeps any spaces and dashes. For example, `4111 1111 1111 1111` becomes `**** **** **** ****`.

#### Redaction settings

**Redact sensitive data in user messages** - Turns redaction on or off for this scenario.

**Replacement character** - The character used to mask redacted data: an asterisk (`*`) or a hash (`#`).

#### Redaction rules

Rules decide what is redacted. Choose a rule type from the list and click **Add rule**. Each rule has its own switch, so you can turn a rule off without deleting it, and the bin icon removes it.

**Payment card number** - Finds card numbers of 13 to 19 digits, written with or without spaces or dashes. It has two options:

* **Also redact the CVV when it follows the card number in the same message** - Masks a 3 or 4 digit security code that appears after a card number. A number labelled `CVV`, `CVC`, `CSC` or `security code` is preferred.
* **Only redact numbers that pass the card checksum (Luhn check)** - Only masks numbers that pass the checksum used by card numbers. This rules out most mistyped and random numbers, but some other long numbers pass it too. Turn this off to mask any 13 to 19 digit number, which catches mistyped card numbers too, but may also mask other long numbers such as account or order references.

**US Social Security number** - Finds 9 digit numbers written as `123-45-6789`, `123 45 6789` or `123456789`.

Each of these two rules can only be added once.

**Custom pattern** - Finds anything matching your own pattern, such as a policy number or a UK National Insurance number. Give the rule a **Name**, which is shown when you test your rules, and a **Pattern**. You can add as many custom patterns as you need.

:::caution
The US Social Security number rule also matches 9 digits written without separators, so it can mask other 9 digit numbers too, such as order or reference numbers. Use the test box below to check it against the kind of messages your users send.
:::

#### Writing a custom pattern

Patterns are written in [I-Regexp](https://www.rfc-editor.org/rfc/rfc9485), a simple and widely supported form of regular expression. The same pattern works the same way in the chat window and on the server.

A pattern matches anywhere in the message. You don't need to match the whole message. Patterns are case sensitive.

| To match | Write | Example |
| --- | --- | --- |
| Any one of a set of characters | `[...]` | `[A-D]` matches A, B, C or D |
| A digit | `[0-9]` | `[0-9]{6}` matches six digits |
| An exact number of repeats | `{n}` | `[A-Z]{2}` matches two capital letters |
| A range of repeats | `{n,m}` | `[0-9]{3,4}` matches 3 or 4 digits |
| One of several options | `\|` inside `( )` | `(GB\|IE)[0-9]{8}` |
| An optional character | `?` | `[A-Z]{2} ?[0-9]{6}` allows an optional space |
| A letter in any language | `\p{L}` | `\p{Lu}` matches any capital letter |

For example, `[A-Z]{2}[0-9]{6}[A-D]` matches a UK National Insurance number written in capitals without spaces, such as `AB123456C`. Users often add spaces, as in `AB 12 34 56 C`, so `[A-Z]{2} ?[0-9]{2} ?[0-9]{2} ?[0-9]{2} ?[A-D]` is a safer choice. To catch lower case too, use `[A-Za-z]` and `[A-Da-d]` for the letters.

Similarly, `[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}` matches an IBAN written without spaces, such as `GB82WEST12345698765432`.

:::note
I-Regexp is a deliberately small subset of regular expressions. Shortcuts such as `\d`, `\w` and `\s`, lookaheads, back references and lazy quantifiers such as `+?` are not supported. Use `[0-9]` instead of `\d`. The characters `^` and `$` are matched literally rather than as the start and end of the message.

If a pattern isn't supported, an error appears under the rule explaining why, and the settings can't be saved until it is fixed.
:::

#### Test your rules

![](~/assets/sensitive-data-redaction-test.png)

*Testing redaction rules*

Type or paste a message into the **Test your rules** box to see what would be redacted with the rules as they are now, including changes you haven't saved yet. Each redacted part is highlighted, and you can hover over it to see which rule redacted it. The test works even while redaction is turned off, so you can try your rules before switching them on.

The test runs the same rules the server uses. Your text is checked on the server and never saved, but use test data rather than real card numbers, such as `4111 1111 1111 1111`.

:::tip
Click **Save Settings** after changing your rules. Changes apply to new messages only; messages that were sent before redaction was turned on are not changed.
:::

#### What is and isn't redacted

Redaction applies to the text of messages users send through webchat, including form and button responses.

It does not apply to:

* Data your website passes to webchat about the user, such as a name or email address set through the [SDK](/developing-with-opendialog/webchat/sdk).
* The contents of files users upload, such as identity documents.
* Messages sent through other channels, such as SMS, WhatsApp or Slack.
* Messages your AI agent sends to the user.
