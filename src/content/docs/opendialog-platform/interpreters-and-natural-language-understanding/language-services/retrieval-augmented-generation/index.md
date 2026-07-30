---
title: Retrieval Augmented Generation
description: Learn how to leverage Retrieval-Augmented Generation (RAG) in your AI application
---

## The Basics

Retrieval Augmented Generation is an advanced system that combines information retrieval with natural language processing techniques  to generate  contextually relevant responses, based on a semantic search over a vectorised knowledge base.

The OpenDialog RAG service allows you to

* upload & manage your own documents, data and information
* convert it into numerical representations  through vectorisation
* query your data via tailored prompting
* generate contextually relevant responses to user queries



![Flowchart showing the Retrieval Augmented Generation process: uploading documents, converting and vectorizing them, querying using prompting, and generating a response.](</.gitbook/assets/1 (3).png>)

*Simplified diagram of the Retrieval Augmented Generation process*

## In Action

#### Use your own data

Generate response from your own data, making sure that responses are accurate and relevant to your user's queries.

#### Dynamic content generation

Rather than depending on statically defined messaging, make your content more dynamic by generating responses based on your up-to-date knowledge.

#### Up-to-date responses

By relying on up-to-date information from retrieval mechanisms, the system can provide more accurate and current responses.

## Where to find

OpenDialog's RAG service allows you to manage your content for  use in your AI application. In addition, the OpenDialog RAG feature provides an overview to manage your different knowledge sources, sorted by relevant topic.

To access the RAG service feature  in your workspace:

:::tip
* Go to your workspace overview by logging in or clicking on the OpenDialog logo
* Select 'Manage language services'
* See the language services dashboard
* View the already created RAG services in the labeled RAG services cards
* Create a new RAG service by using the Create language service button
:::

![](</.gitbook/assets/image (1) (1) (2).png>)

*Access the ability to add a RAG service via the Language Services feature*

## Structure

The OpenDialog service consists of two main components : the settings of your RAG service, and the topics component.

:::note
In some cases, throughout the product you might find that RAG services are referenced to as Knowledge services. These are the same.
:::

The <mark style="color:purple;">**RAG service settings**</mark> section allows you to name  and provide a description for your RAG service to easily recognise it in the Language Services Dashboard. Once it is being used in your applications, you can also visualise the scenarios that are actively using this particular RAG service.

![](/.gitbook/assets/RAG-settings-use.png)

*Access the RAG service settings components via the left-hand menu*

The <mark style="color:purple;">**Topics**</mark> section allows you to define, manage, edit and test the main semantic topics of your RAG service.

![](</.gitbook/assets/image (1) (1) (2) (1).png>)

*The topics overview provides you with an overview of your different topics, and the ability to manage them*

To action the generation of responses based on your RAG service, you will need to use an additional feature of OpenDialog: [<mark style="color:purple;">**LLM Actions**</mark>](/opendialog-platform/interpreters-and-natural-language-understanding/llm-actions).  The setup of a topic in your RAG service will generate a knowledge string that you can reference in your LLM Actions prompt, to ensure that the generated answer uses the knowledge sources you have provided.

## How to use

### Overview

![](/.gitbook/assets/3.png)

*Overview of the steps within OpenDialog to setup and use a RAG service*

\[Video tutorial coming soon]

### Vocabulary

#### RAG

Retrieval Augmented Generation is an advanced system that combines information retrieval with natural language processing techniques  to generate  contextually relevant responses, based on a semantic search over a vectorised knowledge base.

#### Topics

In the context of a Retrieval-Augmented Generation (RAG)  service, a "topic" refers to a specific subject area or theme around which information is organised, retrieved, and generated. Topics help in structuring the knowledge base and guiding the retrieval mechanism to fetch relevant information, which the language model then uses to generate responses.

#### Topic Sources

All of the information that your RAG service topic relies upon is stored in topic sources. The data saved in each of these Topic Sources can be provided in one of several formats: uploading a document, linking to a website, or simply written in as text.

When a topic is queried, behind the scenes, all of the topic sources belonging to that topic will be sifted through to find the segments most relevant to the query.

#### Knowledge strings

A knowledge string is a piece of syntax you will use to reference a specific RAG service, and one of its topics within an LLM action, or for testing purposes in the test panel.

### Set up your RAG service

#### Basic settings

![](</.gitbook/assets/image (2) (2) (1).png>)

*From the Language Services dashboard, view your created RAG services or create a new one*

:::tip
* On the language services dashboard, click the Create New Service button
* Select the '**Create Knowledge-base**'  card for creating a RAG service
* Get taken to the RAG service setup page
* Name your new RAG service (names should not contain spaces or special characters)
* Add a description to your RAG service
* Click 'Create service' button to finish creating your service
:::

![](</.gitbook/assets/image (3) (2).png>)

*RAG service setup page*

#### Advanced settings

:::note
Advanced settings will become available in our next release.
:::

If you are an advanced user of RAG services, and know your way around vectorisation - the Advanced settings section is where you can update the following settings:

**Chunk size**

Chunk size refers to the number of tokens or words that a piece of text is divided into during processing. This setting determines how large each segment, or "chunk," of text will be when it is broken down for analysis or computation. For example, a chunk size of 512 tokens will divide the text into segments of 512 tokens each. Adjusting the chunk size can directly impact the performance and accuracy of text processing tasks like vectorization and information retrieval.

**Chunk overlap**

Chunk overlap is the number of tokens that overlap between consecutive chunks of text. It ensures that important context is preserved across chunks, improving the accuracy of downstream tasks such as information retrieval or machine learning models. For example, if your chunk size is 512 tokens and your chunk overlap is 50 tokens, each chunk will share 50 tokens with the previous chunk. Adjusting chunk overlap can help balance between context preservation and computational efficiency.

**Top K**

Top K refers to the number of top results or items to retrieve during a search or query operation within Retrieval-Augmented Generation (RAG) services. Specifically, it determines how many of the most relevant documents or pieces of information are returned from the database or knowledge base for further processing. For example, setting Top K to 5 will retrieve the 5 most relevant documents based on the search criteria. Adjusting this setting can influence the quality and relevance of the retrieved information, balancing between precision and recall in information retrieval tasks.

### Add your topics and relevant data sources

Once you have created your [RAG ](/opendialog-platform/interpreters-and-natural-language-understanding/language-services/retrieval-augmented-generation#rag)service setup, you will get taken to the [Topics](/opendialog-platform/interpreters-and-natural-language-understanding/language-services/retrieval-augmented-generation#topics) page. This page will be empty when first creating your service. You can start setting up your topics, by clicking on the Add topic button in the top right corner of the middle panel of your screen.

![](</.gitbook/assets/image (6) (2).png>)

*Select the 'Add topic' button from the top right hand corner of your screen*

#### Setting up your topics

:::tip
* In the Topics screen, Click on Add topic
* Define a topic name (should not include spaces or special characters)
* Add a description to your topic to easily identify it in the topics table
* Click the Create topic button in the top right corner of the middle panel of your screen
* This will trigger the 'Add sources' section to appear
:::

![](</.gitbook/assets/image (5) (2).png>)

*Provide a name, description to your topic and create it by clicking on the create topic button*

#### Adding topic sources

Once you have created a topic, you can start adding your documents, data and information to it by using the 'Adding sources' section.

:::tip
* Click on the 'Add sources' button to start adding sources to a topic
* View a dropdown of the different available source types (URL, .pdf and text)
* Select the source type of your data
:::

![](</.gitbook/assets/Select source type.png>)

*Add your information sources to a topic using the 'Add source' dropdown*

<mark style="color:purple;">**Adding a text source**</mark>

Once you have selected text, the text upload modal will pop up. From here you can add your text source name (so that it is easily recognisable from within the topic sources table) and a space where you can add your text source.

:::tip
* Select Text from the add source dropdown
* View the 'Add text source' modal
* Add in your plain text source
* Select 'Upload source' once you are finished
:::

![](</.gitbook/assets/URL 2.png>)

*From the URL uploader modal you can start to add in your URL's in the 'URL Source' field*

<mark style="color:purple;">**Adding a URL source**</mark>

To add a URL source, you first need to select the 'URL' option from the topic source drop down menu.

![](</.gitbook/assets/URL 1.png>)

*Select URL from the topic source dropdown menu*

Once you have selected 'URL' from the topic source dropdown, the URL upload modal will appear. From here, you can add in your source. You can either add in one URL, or you also have the option to add in multiple URL's, separated by a comma list.

You also have the option to include exclusion ID's and Classes. These optional fields allow you to select parts of your URL that you would not like to be referenced. Then when your URL source is vectorised, these ID's and Classes will not be included.

![](</.gitbook/assets/URL 3.png>)

*Here you have the option to input any exclusion ID's and Classes for your URL source(s)*

Once you are happy with the URL\`s selected, you can click the 'Upload source' button to add them to your topic.

![](</.gitbook/assets/URL 4.png>)

*Click the 'Upload source' button to add your URL's to your topic*

:::tip
* Select URL from the add source dropdown
* This will bring up the 'Upload URL's' modal
* From here, add in your URL's to the URL source field
* Add any exclusion classes or ID's that you want to
* Select 'Upload source' once you are finished
:::

<mark style="color:purple;">**Adding a document source**</mark>

To add a document source, you first need to select the 'Document' option from the topic source drop down menu.

The types of document that can be uploaded to your topic as a source are:

* HTML
* CSV
* PDF
* DOCX
* DOC
* TXT
* YAML
*   XLSX



![](</.gitbook/assets/pic 2.png>)

*Select 'Document' from the topic source dropdown menu*

Once you have selected Document, the document upload modal will pop up. From here you can either click to upload a document of your choice, or you can drag and drop files onto the modal. You can upload multiple files at once if you wish to.

![](</.gitbook/assets/pic 3.png>)

*The document upload modal*

After you have selected the files that you want to upload, you can see them listed underneath the document upload modal. If you have accidentally selected a file that you don't wish to upload, you can click the 'X' button next to it's name to remove it from the list.

Once you are happy with the files selected, you can click the 'Upload source' button to add them to your topic.

![](</.gitbook/assets/pic 4.png>)

*Once you're happy with your uploaded documents, click 'Upload source'*

![](</.gitbook/assets/pic 5.png>)

*Once you have uploaded your document, you can see it in your topic sources table*

:::tip
* Select Document from the add source dropdown
* This will bring up the 'Add document' modal
* From here, you can click to add your documents or you can simply drag and drop
* Select 'Upload source' once you are finished
:::

#### Vectorise your topic sources

When you add topic sources to your knowledge service topics, they get stored to the topic sources table. From within the topic source table, you can see all of the topic sources that you have added.

Your topic sources now need to be converted to their numerical representation, using vectorisation.

:::tip
* Select the topic sources you want to vectorise using the checkbox next to them (or the checkbox in the title line to select all)
* Click on the vectorise button
* View the vectorisation status
:::



![](/.gitbook/assets/RAG-vectorisation.png)

*Select your topic sources to start vectorisation*

A topic source can be in one of the following vectorisation statuses :

* <mark style="color:orange;">**Requires Vectorisation**</mark> :  your topic source has not yet been vectorised since its last upload or edit. Your topic source might also be put in this status when it has become obsolete or when the RAG settings have changed. Select the topic source and click the vectorise button to start the process.
* <mark style="color:yellow;">**Vectorisation in progress**</mark> : your topic source is currently being vectorised. Depending on the size of your topic source, this might take a few minutes.
* <mark style="color:green;">**Vectorised**</mark> : your topic source is vectorised and ready to be used by an LLM
* <mark style="color:red;">**Vectorisation failed**</mark> : the vectorisation process of the selected topic source has failed. Verify your settings, and retry.

### Test your RAG service

Once you have vectorised your different topic sources for a given topic, you can now start testing the responses that will get generated based on this information and a user query, using the test panel. 

:::tip
* Go to the third panel on the right-hand side of your screen
* Add a user utterance to test with
* Click on 'Run test'
* View results - scroll down to see the full results
:::

![](</.gitbook/assets/Screenshot 2024-08-12 at 14.26.34.png>)

*Testing your knowledge service using the test panel*

### Retrieve your knowledge string

You can use your RAG service in your AI application by referencing it through a [knowledge string](/opendialog-platform/interpreters-and-natural-language-understanding/language-services/retrieval-augmented-generation#knowledge-strings) in other services, like LLM Actions.  In order to do so, you need to retrieve or construct the relevant knowledge strings.

![](</.gitbook/assets/2 (1) (2).png>)

*Syntax structure of a knowledge string*

#### Retrieving a knowledge string

The easiest way to retrieve your knowledge string is by going into the test panel of a specific topic.  The default system prompt already has your pre-formatted knowledge string in it.  You can simply copy/paste it for use in an LLM action.

**Example**:

```
%%MyKnowledgeService.topic?{utterance_text}%%
```

#### Constructing a knowledge string from scratch

You can construct your knowledge string from scratch, and use it elsewhere in the OpenDialog platform by typing `%%` followed by your knowledge string syntax.

To use your RAG service from within a system prompt you should use the special syntax `%% [service].[topic] %%` to reference the data you want to use. For example if you have a knowledge service called 'countries\_ks' and you want to reference the 'capital\_cities' topic data you would use `%% countries_ks.capital_cities%%`.

You should also add a query to only return the topic data that is useful to the user's question. To do this, the syntax is\
`%% [service].[topic] ? [query] %%`

:::caution
If you omit to add the additional query, the LLM will systematically return the full information of your topic source without making it relevant to the user query.
:::

#### **An example knowledge service string, used in a system prompt:**

`"You are a chatbot answering user questions. You may only find your answer from within the following data: %% countries_ks.capital_cities ? France %%`

### Set up an LLM action referencing a RAG service

In order to use the knowledge from within a specific RAG service to generate responses in your OpenDialog application, you will need to:

:::tip
* Create an[ LLM action](/opendialog-platform/interpreters-and-natural-language-understanding/llm-actions) for response regeneration, referencing your RAG service as part of the system prompt, using a [knowledge string](/opendialog-platform/interpreters-and-natural-language-understanding/language-services/retrieval-augmented-generation#retrieve-your-knowledge-string)
* Add the LLM action to the relevant application intent in your conversation design
* Add the relevant output attributes of your LLM action in the outgoing message, using the Message Editor.
:::

#### Using a knowledge string in your LLM action

:::note
For more information on LLM actions, please check the [**LLM Actions**](/opendialog-platform/interpreters-and-natural-language-understanding/llm-actions) section of the documentation.
:::

![](/.gitbook/assets/RAG-LLMactions.png)

*Using the AboutCompany RAG service in an LLM action*

:::tip
* In your LLM action, go to the 'Prompt configuration' tab.
* Write your system prompt, including the reference to your RAG service where relevant.
:::

For example:

```
You are a helpful customer service assistant. 

The user will provide you with questions
related to the organisation, its founders, its originis and its vision. 

Your goal is to provide a relevant response to their queries.  

Construct your response using the following data: 
%%MyKnowledgeService.AboutCompany?{utterance_text}%%
```

:::danger
Make sure to never forgot the closing `%%` syntax, otherwise your  data will not get referenced and the LLM will provide a general, non-relevant response.
:::

### Add your RAG-based LLM Action to your conversation design

In order to use your RAG-based generated response in your conversation design, you will need to update it to run the LLM action on the relevant intent and reference its output in the relevant message.

#### Adding your RAG-based LLM Action to the conversation design

Just like other LLM actions, in order for them to run, they need to be added to the intent they are relevant for.

:::tip
* Go to the Designer section of your scenario using the left-hand menu
* Navigate to the correct intent within the designer
* Within the third panel, click 'Add conditions, actions & attributes'
* Click '+ Add new action' and select your action from the drop-down
* Add the relevant output attributes (if needed)
:::

#### Adding your RAG-based LLM Action output to the messages

Your LLM action's response based on the RAG knowledge will be stored against an output attribute.  If you have not defined a specific output attribute in your LLM action, the default output attribute will be `<llm_response>.`

:::tip
* Go to the Message Editor section of your scenario using the left-hand menu
* Navigate to the correct message using the breadcrumbs on the top of your screen
* Edit your message using the edit icon in its top-right corner
* Reference your content in the message type of your choice using the following {attributename}
:::



![](/.gitbook/assets/RAG-response.png)

*Reference your generated response via the output attribute*
