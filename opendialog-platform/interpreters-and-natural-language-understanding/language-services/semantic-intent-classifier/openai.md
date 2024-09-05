# OpenAI

## Where to find

Semantic Intent Classifiers allow you to integrate with a large language model provider, for example, OpenAI, in order to allow your scenario to understand user input. It can be found under the Language Services section of your OpenDialog Workspace. Once you select 'Create new service' and subsequently 'Semantic Intent Classifier' you will then have the opportunity to create it. Select OpenAI to start setting up your OpenAI integration.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-07-08 at 18.05.09.png" alt=""><figcaption><p>Setting up an OpenAI integration via OpenDialog</p></figcaption></figure>

## What you'll need

To set up an integration between your Semantic Intent Classifier, and an OpenAI model, you can either use OpenDialog's managed credentials, or your own credentials if you prefer. Selecting 'OpenDialog managed' means you will use a service directly managed by OpenDialog, and will not need to provide any credentials. If you would like to use your own credentials, you will need an OpenAI account.&#x20;

[How to create an OpenAI account](https://platform.openai.com/docs/quickstart)

If you are using your own credentials, unselect 'OpenDialog managed' and provide the following three elements:

* The **OpenAI API Key** is an API key associated with your OpenAI account. This can be found under the ["API keys"](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key) page in your OpenAI platform.
* The **OpenAI Organisation** is a unique identifier for your organisation within OpenAI. This can be found on the [general settings](https://platform.openai.com/settings/organization/general) page under "Organization ID".
* The **Model** is an identifier for the large language model that you would like to use. OpenAI provides a list of [pre-built model](https://platform.openai.com/docs/models/gpt-4o) identifiers, or you can use a custom fine-tuned model identifier associated with your organisation.

## How to use

### Setting up the OpenAI Semantic Intent Classifier in OpenDialog

To set up your OpenAI Semantic Intent Classifier, navigate to "Language services". Use the "Create new service" button to begin creating a new Language service. Next select the "Semantic Intent Classifier type".

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-07-08 at 18.21.46.png" alt=""><figcaption><p>Use the "Create an LLM action" button to set up a new OpenAI integration</p></figcaption></figure>

After providing a name and a description for your Semantic Intent Classifier, select "Open AI" and provide the necessary account details to set up your integration. Hit 'Create Service' to set up this integration and use it within your scenario.

### Using the OpenAI Semantic Intent Classifier in your scenario

To use your OpenAI Semantic Intent Classifier within your scenario, you will need to create an Interpreter. Navigate to "Interpret" and click "Add new interpreter'. Enter a name for the interpreter and then select the Language Service type. This will provide you with a field in which you need to select the Semantic Intent Classifier you created. Once you have selected the desired Language service, click "Save Configuration".

Now that you have created an interpreter, you can add it to an intent in the Designer. Navigate to "Design" and then into the conversation, scene and turn that you would like to use the Semantic Intent Classifier within. Create a user intent and select the interpreter you created, which will be annotated with a purple "SIC" label. After selecting the interpreter you can select one of its intents in the intent name field. Once you have done this you have successfully connected your Semantic Intent Classifier to your scenario.

### Testing the OpenAI Semantic Intent Classifier in your scenario

You can check your Semantic Intent Classifier by testing your conversation in the Preview (Test - Preview). When you navigate to the area of the conversation which uses your classifier and you provide a valid input, you should see the desired intent is matched under the "Incoming Intent" panel. If you defined any output attributes you will also see these in the right-hand side "Context" panel, as well as any other [output attributes](output-attributes.md).
