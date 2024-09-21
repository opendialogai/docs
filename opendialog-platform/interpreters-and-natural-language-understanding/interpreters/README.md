# Interpreters

An Interpreter processes a user input and matches it to an intent. Intents act as categories of user utterances. For example "What will the temperature be like today?" could be matched to a "Temperature" intent, whereas "Hello" could be matched to a "Greeting" intent.

Interpreters also allow you to configure your bot with a variety of functionalities depending on your needs such as more granular intent matching, source analysis and response matching, Intent Classification, third-party NLU integration and webhook API integration. By default, OpenDialog comes pre-configured with a default 'OpenDialog' interpreter which is used throughout your scenario.

Interpreters are broken down into three categories in OpenDialog:&#x20;

* **Those that connect with Language Services** (Semantic Intent Classifiers, Knowledge Services, or Intent Classifiers)&#x20;
* **Third-party NLU interpreters** (OpenAI, Azure, Amazon LEX, Google Dialogflow, and custom configurations)&#x20;
* **Webhook Interpreters** (for API integration)&#x20;

You can choose the best Interpreter for your scenario from the 'Interpret' landing page.&#x20;

{% hint style="success" %}
To create an interpreter:&#x20;

* Log in to your OpenDialog account&#x20;
* Select a workspace and click 'Manage scenarios'&#x20;
* Review which scenario you would like to add an interpreter in
* Select the scenario, and navigate to the sidebar&#x20;
* Select 'Interpret'&#x20;
* From the Interpret landing page, select the Interpreter that best suits your needs&#x20;
{% endhint %}

{% hint style="info" %}
Additional steps are required to complete the integration set-up between OpenDialog, and a third-party NLU service. You will also need to create intents in the third-party service.
{% endhint %}

Multiple Interpreters can exist within a single scenario, and each Interpreter can fulfil a different purpose. Every Interpreter you create will be shown as a card on the 'Interpret' landing page.&#x20;

<figure><img src="../../../.gitbook/assets/2023-05-02_12-11-35.png" alt=""><figcaption><p>Interpreters overview page</p></figcaption></figure>

<figure><img src="../../../.gitbook/assets/2023-05-02_12-11-15.png" alt=""><figcaption><p>Adding a new interpreter page</p></figcaption></figure>

Once an Interpreter is available and set to active using the toggle switch, it can be [referenced in the conversation structure](../../../core-concepts/the-opendialog-workspace/scenarios/turns-and-intents.md#interpreter-and-confidence-level) at the component level.&#x20;
