---
description: This section outlines how you can set up a LLM action using Azure OpenAI.
---

# Azure OpenAI

## Where to find

LLM Actions allow you to integrate with a large language model provider, for example, Azure OpenAI. It can be found under the Integrate section of a specific scenario. Once you select 'Create an LLM action' you will then have the opportunity to create the LLM action of your choice. Select Azure OpenAI to start setting up your OpenAI integration.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-08 at 18.30.02.png" alt=""><figcaption><p>Setting up an Azure OpenAI integration via OpenDialog</p></figcaption></figure>

## What you'll need

To set up an integration between your LLM action, and an Azure OpenAI model, you will need to create an Azure OpenAI Service resource within your Azure account.&#x20;

[How to create an Azure OpenAI Service resource](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal)

You will also need to [create a model deployment](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) within the service.

To configure your Azure OpenAI LLM action you will need to provide the following three elements:

* The **Azure OpenAI API Key** is an API key associated with your service. This can be found in your Azure portal by navigating to your Azure OpenAI Service resource, and selecting "Resource Management" and then "Keys and Endpoint". You can use either Key 1 or Key 2.
* The **Azure OpenAI Resource Name** is the name of the resource in Azure.
* The **Azure OpenAI Deployment Name** is the name of the deployment. It's important to note that the deployment name is defined when you create the deployment, and will not be the name of the underlying OpenAI model.

## How to use

### Setting up the Azure OpenAI LLM action in OpenDialog

To set up your Azure OpenAI LLM action, navigate to "Integrate", and select "LLM Actions" from the menu. Use the "Create an LLM action" button to set up a new LLM action.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-08 at 18.21.46.png" alt=""><figcaption><p>Use the "Create an LLM action" button to set up a new Azure OpenAI integration</p></figcaption></figure>

After providing a name and a description for your LLM action, select "Azure OpenAI" and provide the necessary account details to set up your integration. Hit 'Save' to set up this integration and use it within your scenario.

### Using the Azure OpenAI LLM action in your scenario

To use your Azure OpenAI LLM action in your scenario, you can add it to an intent in the Designer.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-08 at 18.25.21.png" alt=""><figcaption><p>Select the desired intent in the designer and click "Add conditions, actions &#x26; attributes" to reveal the Action section</p></figcaption></figure>

When your scenario matches this intent, the prompts will be sent to the LLM and any output attributes will be populated.

To display the LLM's response text in your scenario, you will need to use the `llm_response` attribute (or any other desired output attributes) within a [message](../../conversation-designer/message-design/message-editor.md). Within a message, create a new text block, set the text to `{llm_response}` and click "Save Message".

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-09 at 09.52.58.png" alt=""><figcaption><p>Create a text message using the LLM's response by using the <code>llm_response</code> attribute</p></figcaption></figure>

### Testing the OpenAI LLM action in your scenario

You can check if your action is successful by testing your conversation in the Preview (Test - Preview) and checking the user context on the right side of your screen. When you match the intent with the action then the user context will update to include `action_success: true` as well as any other [output attributes](./#use-custom-output-attributes), such as `llm_response`.
