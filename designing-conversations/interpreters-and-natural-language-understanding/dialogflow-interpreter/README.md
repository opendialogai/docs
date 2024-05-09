# Google Dialogflow

The OpenDialog Dialogflow integration allows us to use Dialogflow intent interpretation, entity extraction and the Dialogflow knowledge bases. This means that you can use one or more Dialogflow agents as your NLU interpreters and do all the conversation design in OpenDialog.&#x20;

## Create a Dialogflow ES agent

The first step to using Dialogflow is to create an [ES Dialogflow agent](https://cloud.google.com/dialogflow/es/docs). We are using Dialogflow as just an NLU service so we will be focussing on just training intents, extracting entities and (if and when required) setting up knowledge bases.

## Create an API access key in the Google Cloud Console

Once you've created an agent follow the instructions here to generate an API key.&#x20;

1. Go to the settings of you Dialogflow agent and click on the project link to go to the Google Cloud project console

![](<../../../.gitbook/assets/image (380).png>)

2\. From within the Google Cloud console project go to the IAM & Admin > Service Accounts.&#x20;

![](<../../../.gitbook/assets/image (426).png>)

3\. Create a service account and give it the Dialogflow API Admin role. You will need to give it an ID and then grant the Role as shown below.&#x20;

![Creating an service user for the Dialogflow API through the Google Cloud Console](<../../../.gitbook/assets/image (192).png>)

4\. Click on the account just created, head to the Keys tab and create a JSON key which will generate a file and download it to your machine.&#x20;

![Generating a JSON key for Dialogflow API access](<../../../.gitbook/assets/image (414).png>)

We will now use this JSON key in our next step when creating our Dialogflow interpreter in OpenDialog.
