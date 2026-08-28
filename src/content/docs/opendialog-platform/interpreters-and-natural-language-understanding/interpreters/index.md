---
title: Interpreters
---

An Interpreter processes a user input and matches it to an intent. Intents act as categories of user utterances. For example "What will the temperature be like today?" could be matched to a "Temperature" intent, whereas "Hello" could be matched to a "Greeting" intent.

Interpreters also allow you to configure your bot with a variety of functionalities depending on your needs such as more granular intent matching, source analysis and response matching, Intent Classification, third-party NLU integration and webhook API integration. By default, OpenDialog comes pre-configured with a default 'OpenDialog' interpreter which is used throughout your scenario.

Interpreters are broken down into three categories in OpenDialog:

* **Those that connect with Language Services** (Semantic Intent Classifiers, Knowledge Services, or Intent Classifiers)
* **Third-party NLU interpreters** (OpenAI, Azure, Amazon LEX, Google Dialogflow, and custom configurations)
* **Webhook Interpreters** (for API integration)

You can choose the best Interpreter for your scenario from the 'Interpret' landing page.

:::tip
To create an interpreter:

* Log in to your OpenDialog account
* Select a workspace and click 'Manage scenarios'
* Review which scenario you would like to add an interpreter in
* Select the scenario, and navigate to the sidebar
* Select 'Interpret'
* From the Interpret landing page, select the Interpreter that best suits your needs
:::

:::note
Additional steps are required to complete the integration set-up between OpenDialog, and a third-party NLU service. You will also need to create intents in the third-party service.
:::

Multiple Interpreters can exist within a single scenario, and each Interpreter can fulfil a different purpose. Every Interpreter you create will be shown as a card on the 'Interpret' landing page.

![](~/assets/2023-05-02-12-11-35.png)

*Interpreters overview page*

![](~/assets/2023-05-02-12-11-15.png)

*Adding a new interpreter page*

Once an Interpreter is available and set to active using the toggle switch, it can be [referenced in the conversation structure](/core-concepts/the-opendialog-workspace/scenarios/turns-and-intents#interpreter-and-confidence-level) at the component level.
