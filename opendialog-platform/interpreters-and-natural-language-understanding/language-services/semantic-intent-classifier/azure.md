# Azure

## Where to find

Semantic Intent Classifiers allow you to integrate with a large language model provider, for example, Azure OpenAI, in order to allow your scenario to understand user input. It can be found under the Language Services section of your OpenDialog Workspace. Once you select 'Create new service' and subsequently 'Semantic Intent Classifier' you will then have the opportunity to create it. Select Azure OpenAI to start setting up your Azure OpenAI integration.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-07-08 at 18.05.09.png" alt=""><figcaption><p>Setting up an OpenAI integration via OpenDialog</p></figcaption></figure>

## What you'll need

To set up an integration between your LLM action, and an Azure OpenAI model, you will need to create an Azure OpenAI Service resource within your Azure account.&#x20;

[How to create an Azure OpenAI Service resource](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal)

You will also need to [create a model deployment](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) within the service.

To configure your Azure OpenAI LLM action you will need to provide the following three elements:

* The **Azure OpenAI API Key** is an API key associated with your service. This can be found in your Azure portal by navigating to your Azure OpenAI Service resource, and selecting "Resource Management" and then "Keys and Endpoint". You can use either Key 1 or Key 2.
* The **Azure OpenAI Resource Name** is the name of the resource in Azure.
* The **Azure OpenAI Deployment Name** is the name of the deployment. It's important to note that the deployment name is defined when you create the deployment, and will not be the name of the underlying OpenAI model.

## How to use

### Setting up the Azure OpenAI Semantic Intent Classifier in OpenDialog

To set up your Azure OpenAI Semantic Intent Classifier, navigate to "Language services". Use the "Create new service" button to begin creating a new Language service. Next select the "Semantic Intent Classifier type".

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-07-08 at 18.21.46.png" alt=""><figcaption><p>Use the "Create an LLM action" button to set up a new OpenAI integration</p></figcaption></figure>

After providing a name and a description for your Semantic Intent Classifier, select "Azure Open AI" and provide the necessary account details to set up your integration. Hit 'Create Service' to set up this integration and use it within your scenario.

### Using the Azure OpenAI Semantic Intent Classifier in your scenario

To use your Azure OpenAI Semantic Intent Classifier within your scenario, you will need to create an Interpreter. Navigate to "Interpret" and click "Add new interpreter'. Enter a name for the interpreter and then select the Language Service type. This will provide you with a field in which you need to select the Semantic Intent Classifier you created. Once you have selected the desired Language service, click "Save Configuration".

Now that you have created an interpreter, you can add it to an intent in the Designer. Navigate to "Design" and then into the conversation, scene and turn that you would like to use the Semantic Intent Classifier within. Create a user intent and select the interpreter you created, which will be annotated with a purple "SIC" label. After selecting the interpreter you can select one of its intents in the intent name field. Once you have done this you have successfully connected your Semantic Intent Classifier to your scenario.

### Testing the Azure OpenAI Semantic Intent Classifier in your scenario

You can check your Semantic Intent Classifier by testing your conversation in the Preview (Test - Preview). When you navigate to the area of the conversation which uses your classifier and you provide a valid input, you should see the desired intent is matched under the "Incoming Intent" panel. If you defined any output attributes you will also see these in the right-hand side "Context" panel, as well as any other [output attributes](output-attributes.md).
