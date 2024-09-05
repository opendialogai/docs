# Google Gemini

## Where to find

Semantic Intent Classifiers allow you to integrate with a large language model provider, for example, Google Gemini, in order to allow your scenario to understand user input. It can be found under the Language Services section of your OpenDialog Workspace. Once you select 'Create new service' and subsequently 'Semantic Intent Classifier' you will then have the opportunity to create it. Select Google Gemini to start setting up your Gemini integration.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-07-08 at 18.05.09.png" alt=""><figcaption><p>Setting up an OpenAI integration via OpenDialog</p></figcaption></figure>

## What you'll need

To set up an integration between your LLM action, and an Google Gemini model, you will need to have a Google Cloud account. Within your account you will need to create a project and enable the Vertex API. After this you will need to create an Google Service Account with the role of "[Vertex AI User](https://cloud.google.com/vertex-ai/docs/general/access-control#aiplatform.user)" and download a JSON key.&#x20;

1. [How to create a project and enable the Vertex API](https://cloud.google.com/vertex-ai/docs/featurestore/setup#configure\_project)
2. [How to create and download a JSON key](https://developers.google.com/workspace/guides/create-credentials#create\_credentials\_for\_a\_service\_account)

To configure your Google Gemini Semantic Intent Classifier you will need to provide the following four elements:

* The **Location** which is the [valid region and zone](https://cloud.google.com/compute/docs/regions-zones#available) the integration should use, such as `europe-west2`.
* The **Project ID** which is the name of the project that the Service Account belongs to.
* The **Model** which is the specific [Gemini LLM](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models) you would like to use,  such as `gemini-1.5-pro`.
* The **JSON credentials** which is the contents of the JSON key file you downloaded from your Google Cloud Service account.

## How to use

### Setting up the Google Gemini Semantic Intent Classifier in OpenDialog

To set up your Google Gemini Semantic Intent Classifier, navigate to "Language services". Use the "Create new service" button to begin creating a new Language service. Next select the "Semantic Intent Classifier type".

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-07-08 at 18.21.46.png" alt=""><figcaption><p>Use the "Create an LLM action" button to set up a new OpenAI integration</p></figcaption></figure>

After providing a name and a description for your Semantic Intent Classifier, select "Google Gemini" and provide the necessary account details to set up your integration. Hit 'Create Service' to set up this integration and use it within your scenario.

### Using the Google Gemini Semantic Intent Classifier in your scenario

To use your Google Gemini Semantic Intent Classifier within your scenario, you will need to create an Interpreter. Navigate to "Interpret" and click "Add new interpreter'. Enter a name for the interpreter and then select the Language Service type. This will provide you with a field in which you need to select the Semantic Intent Classifier you created. Once you have selected the desired Language service, click "Save Configuration".

Now that you have created an interpreter, you can add it to an intent in the Designer. Navigate to "Design" and then into the conversation, scene and turn that you would like to use the Semantic Intent Classifier within. Create a user intent and select the interpreter you created, which will be annotated with a purple "SIC" label. After selecting the interpreter you can select one of its intents in the intent name field. Once you have done this you have successfully connected your Semantic Intent Classifier to your scenario.

### Testing the Google Gemini Semantic Intent Classifier in your scenario

You can check your Semantic Intent Classifier by testing your conversation in the Preview (Test - Preview). When you navigate to the area of the conversation which uses your classifier and you provide a valid input, you should see the desired intent is matched under the "Incoming Intent" panel. If you defined any output attributes you will also see these in the right-hand side "Context" panel, as well as any other [output attributes](output-attributes.md).
