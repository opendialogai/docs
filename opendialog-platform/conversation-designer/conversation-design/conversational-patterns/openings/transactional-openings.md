---
description: Examples of transactional openings for text-based assistants
---

# Transactional openings

The linguistic analysis in the previous pages suggests a number of aspects for an opening. On this page, we will take that information as input, craft a list specific to virtual assistants, and more specifically focus on transactional openings. &#x20;

Typical items in an opening are:

1. **Greeting,** e.g. "Hello", "Welcome"
2. **Self-identification,** the assistant introduces themselves, e.g. "I am Leo, your Lowe's automated assistant."
3. **What the assistant can do** for the user, e.g. "Here's what I can help you with". The options appear as buttons. In general, it is advisable to provide a list of items the assistant can help with rather than providing an open-ended "How may I help you" which may lead to user responses that the assistant is not equipped to handle
4. **Instructions on how to interact** with the assistant, e.g. "Type "menu" if you need to start over."
5. **Consent**, if applicable, such as consent to a Privacy Statement, Terms of Use or consent to use personal information, e.g. in health care
6. **Authentication**, if applicable, to determine whether a user is a returning or new user. This can be used early in the greeting to determine which options to display. If the options remain the same, it is recommended to authenticate only when needed in order to reduce the barrier of entry
7. **Personalization**, if access to this information is available, use of the user's first name in the greeting, e.g. "Hello, Avery"
8. **Relevant prior information** for known or returning/authenticated users. E.g. an appointment confirmation assistant informs the user of the appointment in question as part of justifying why the assistant is contacting the user (e.g. through SMS). E.g. when a returning user engages with an assistant, the assistant may take the opportunity to suggest relevant information (example Bank of America's Erica below)

This list above is a great starting point. Items 5 through 8 come with certain conditions and the exact items to include in the greeting will depend on the specific context in which the assistant is used. &#x20;

Consider an assistant on a website support page. That assistant may have been introduced elsewhere on the page, something like "Use the virtual assistant to get quick answers to your questions".  The context is the support page, so the topics the assistant handles are support type topics. The "quick answers to your questions" bit may even imply that this is an alternative to searching the support knowledge base. Given this context, the opening in the assistant itself can be reduced quite a bit. At a minimum, the opening explains what the assistant can do. Even though the context on what the assistant can help with has been set, it is always a good practice to list the most common types of requests as options. The greeting will likely be added as well; it's a short item and it's quite natural to greet a user, especially since the assistant is another channel the user is switching to. A greeting helps with that transition. &#x20;

In situations where authentication is possible, consider creating a more elaborate opening for new users, and a most concise one for returning users, assuming that returning users access the assistant on a regular basis, and have built up familiarity with the assistant and options.&#x20;

On this page we focus on the types of items in an opening. We are not focusing on the wording of the items, but the personality and tone (described in the Best Practices section) influence what words are used, and influence the verbosity or brevity of the actual prompts. &#x20;

**Examples**

Lowe's is a home improvement store. The automated assistant opening contains the majority of items in the list. Authentication is not necessary yet; the assistant can help with a number of actions that don't need customer authentication. Once a customer is authenticated, presumably after selecting "My Orders", personalization can be applied as well.&#x20;

Numbers refer to the numbered list above.&#x20;

<figure><img src="../../../../../.gitbook/assets/2023-05-04_15-58-27 (1).png" alt="" width="373"><figcaption><p>lowes.com</p></figcaption></figure>

Okta's OktaBot uses a more transactional style. The bot greets the user. The self-identification is more implicit in the header and above the prompt. The bot goes straight into authentication to then show the relevant options.&#x20;

![](<../../../../../.gitbook/assets/2023-05-04\_16-17-09 (1).png>)     ![](<../../../../../.gitbook/assets/2023-05-04\_16-23-35 (1).png>)



Erica is the assistant for Bank of America. Erica is integrated in the mobile app, and has been featured for a number of years, so the need for self-identification is less of a priority.&#x20;

Erica greats the user, and since the assistant is integrated in the app, access to the first name is available for personalization.&#x20;

Next Erica actually shows "new insights": a list of things that may interest me as a user, before showing the options.

![](../../../../../.gitbook/assets/spaces\_IT4T0sJdqeqCXi1fUCAu\_uploads\_mWtXL3ueFl5AvnJIeQBH\_IMG-6998.webp)      ![](<../../../../../.gitbook/assets/spaces\_IT4T0sJdqeqCXi1fUCAu\_uploads\_uK8yZf49ckvTwbfi1qDG\_IMG-6996 (1).webp>)



## More examples

Variants of a generic example with a greeting and options:

`A: Hello! How may I help you? [show 2 - 5 buttons with most commonly requested topics]`

`A: Welcome! Here’s what I can do for you. [show 2 - 5 buttons with most commonly requested topics]`



A generic example that explicitly suggests the option to type in other requests:

`A: Welcome! What can we help you with today? For something else, please type in the space below. [show 2 - 5 buttons with most commonly requested topics]`



Examples with user authentication that allows a level of personalization:

`A: Welcome back, {user.first_name}! How can I help you today? [Order Status], … other options Because the user is authenticated we provide options specific to authenticated users first.`

One step further: `A: Welcome back, {user.first_name}! Are you contacting us about your open order or something else? [My open order] [common option 1] [common option 2], …`



Example with reason for contacting the user embedded in opening:

`A: Good afternoon, {user.first_name}. I am Avery, the Car Service shop assistant. You have an appointment for an oil change scheduled for the day of tomorrow, Friday 14 May at 8 AM. [Confirm] [I need to change this]`
