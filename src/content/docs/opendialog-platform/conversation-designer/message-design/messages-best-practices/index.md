---
title: Messages best practices
---

## Bite-size pieces are easier to read

A single turn may include several pieces of information. For instance, it may include a welcome, some instructions, and some facts such as appointment information to verify during the interaction.

It helps legibility if the information is provided in multiple messages (all within the same app intent).

Notice the difference between the following screens:

![](/.gitbook/assets/2023-05-23_13-09-37.png)

*All text in a single message*

![](/.gitbook/assets/2023-05-23_13-10-36.png) ![](</.gitbook/assets/2023-05-23_10-57-47 (2).png>)

## Words per app turn

How much information can be conveyed in a single app turn? This depends to some extent on the nature of the assistant and the interaction. Some turns convey a lot of information, some can be quite concise. E.g. "Thank you. Anything else?"

A key practice is to make sure that the content of a single turn does not exceed the screen height. In other words, the user should not have to scroll to view all the information that is shared in a single turn. To force the user to do so requires effort from the user, they may hardly be aware that there is more information that scrolled up, and it breaks the easy reading experience.

A rule of thumb in a typical OpenDialog assistant is to limit the text in a single turn (if the content consists entirely of text):

* 9 lines with buttons, ideally in 3 or 4 chunks
* Consider that on average, each line holds about 30 - 35 characters, or 5 to 6 words of average length (based on an average word length in English of 4.7 characters per word).

![](</.gitbook/assets/2023-05-23_10-57-47 (5).png>)

*Example screen and content*

Always test your assistant to make sure the content does not scroll up. Note that images or carousels take up a lot of vertical space, so be mindful of the amount of text you add before or after such an element in a single turn.

## Best Practices for Expandable Messages

When using expandable messages, follow these UX guidelines:

### Core Principles

1. **Show enough to decide** - Users should be able to understand what they'll get by expanding
2. **Front-load value** - Put the most important information first so it's visible when collapsed
3. **Hide depth, not meaning** - Collapse additional details, not essential information
4. **Don't hide what's needed to act** - If a message requires user action, ensure action items are visible

### Recommended Minimums

| Message Type         | Recommended Minimum Height           |
| -------------------- | ------------------------------------ |
| Text Message         | 6em                                  |
| Rich Message (text)  | 2-4em                                |
| Rich Message (whole) | Show title at minimum                |
| Button Message       | Show at least 2 primary options      |
| Options Message      | Show at least 2-3 selectable options |
| Form Message         | Show at least first 2 fields         |

### When to Use Expandable Messages

**Good use cases:**

* Long LLM-generated responses
* Detailed FAQ answers
* Legal/terms content that most users won't need to read in full
* Long lists of options where common choices are at the top

**Avoid expandable messages when:**

* The full content is critical for user decision-making
* The message is already short
* Users need to see all options to make an informed choice

### Validation Requirements

Remember these validation rules:

* `expandable-text="true"` requires either `expandable-text-height` OR `expandable-text-chars` (not both)
* `expandable-message="true"` requires `expandable-message-height`
* If validation fails, the message will render as a standard (non-expandable) message
