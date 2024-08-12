---
description: >-
  This section informs you what types of topic sources you can add to your RAG
  service and how to vectorise them
---

# Topic Sources and Vectorisation

## What is a topic source?

All of the information that your RAG service topic relies upon is stored in topic sources. The data saved in each of these Topic Sources can be provided in one of several formats: uploading a document, linking to a website, or simply written in as text.&#x20;

When a topic is queried, behind the scenes, all of the topic sources belonging to that topic will be sifted through to find the segments most relevant to the query.

## How to add a topic source

When adding a new topic source, there are two ways you can do it. One is when you haven't added any previous topic sources. If this is the case then you want to go to the empty state on your topic overview and click the 'Add source' button. If you have already added topic sources to your topic, then you can select the 'Add source' button from above the source table, on the right hand side.

<figure><img src="../../../../.gitbook/assets/Group 15 (1).png" alt=""><figcaption><p>How to add a source if there are no sources already</p></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Group 16 (1).png" alt=""><figcaption><p>How to add a source if you have already added topic sources</p></figcaption></figure>

Once you have clicked on the 'Add source' button, this will bring up a dropdown menu. From this dropdown menu you can select which type of topic source you would like to add to your Knowledge Service. The options are:

* **Text**
* **URL**
* **Document**

There is more information on how to add these individual text sources in the next section.

{% hint style="info" %}
Currently the only option for adding topic sources is Text. However the ability to upload URL and Document sources will be coming in a future release
{% endhint %}

<figure><img src="../../../../.gitbook/assets/Group 17 (1).png" alt=""><figcaption><p>Select the type of topic source that you want from the dropdown </p></figcaption></figure>

{% hint style="success" %}
* Select the 'Add source' button
* Go to the drop down menu
* Select whether you would like to add Text, URL or Document
{% endhint %}

## The topic source table

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-08-08 at 10.45.30 1.png" alt=""><figcaption><p>An overview of a full topic source table</p></figcaption></figure>

When you add topic sources to your knowledge service topics, they need to be stored somewhere. This is where the topic sources table comes in! From within the topic source table, you can see all of the topic sources that you have added. The topic source table is broken down into different sections such as:

* **Topic source name**
* **Source type**
* **Vectorisation status**
* **Edit**

The vectorisation status section of the topic sources table lets you know in what state your topic source is in in regards to vectorisation. There are 6 different states that it can be in. For example:

* **Vectorised**
* **Requires Vectorisation - Hasn't yet been vectorised**
* **Requires Vectorisation - Obsolete (no longer valid)**
* **Requires Vectorisation - Incompatible (RAG settings have changed)**
* **Vectorisation in progress**
* **Vectorisation failed**

## Types of topic source

## Text

### How to add a plain text source

To add a plain text source, you first need to select the 'Text' option from the topic source drop down menu.

<figure><img src="../../../../.gitbook/assets/Group 21 (1).png" alt=""><figcaption><p>Select text from the drop down menu</p></figcaption></figure>

Once you have selected text, the text upload modal will pop up. From here you can add your text source name (so that it is easily recognisable from within the topic sources table) and a space where you can add your text source. In this section, you can simply copy and paste, or just type, whatever text you would like to keep within this topic source.

<figure><img src="../../../../.gitbook/assets/group 22.png" alt=""><figcaption><p>The text uploader modal</p></figcaption></figure>

Once you are done, click 'Upload source' to upload this data and your topic source to your knowledge service.

<figure><img src="../../../../.gitbook/assets/group 23.png" alt=""><figcaption><p>Select 'Upload source' to upload your plain text source to your topic table</p></figcaption></figure>

{% hint style="success" %}
* Select Text from the add source dropdown
* This will bring up the 'Add text source' modal
* From here, add in your plain text source
* Select 'Upload source' once you are finished
{% endhint %}

## Documents

{% hint style="warning" %}
This feature will be available to use soon in an upcoming release.
{% endhint %}

### What types of document can be uploaded?

The types of document that can be uploaded to your topic as a source are:

* HTML
* CSV
* PDF
* DOCX
* DOC
* TXT
* YAML
* XLSX

### How to add a document source

To add a document source, you first need to select the 'Document' option from the topic source drop down menu.

<figure><img src="../../../../.gitbook/assets/pic 2.png" alt=""><figcaption><p>Select 'Document' from the topic source dropdown menu</p></figcaption></figure>

Once you have selected Document, the document upload modal will pop up. From here you can either click to upload a document of your choice, or you can drag and drop files onto the modal. You can upload multiple files at once if you wish to.&#x20;

<figure><img src="../../../../.gitbook/assets/pic 3.png" alt=""><figcaption><p>The document upload modal</p></figcaption></figure>

After you have selected the files that you want to upload, you can see them listed underneath the document upload modal. If you have accidentally selected a file that you don't wish to upload, you can click the 'X' button next to it's name to remove it from the list.

Once you are happy with the files selected, you can click the 'Upload source' button to add them to your topic.

<figure><img src="../../../../.gitbook/assets/pic 4.png" alt=""><figcaption><p>Once you're happy with your uploaded documents, click 'Upload source'</p></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/pic 5.png" alt=""><figcaption><p>Once you have uploaded your document, you can see it in your topic sources table</p></figcaption></figure>

{% hint style="success" %}
* Select Document from the add source dropdown
* This will bring up the 'Add document' modal
* From here, you can click to add your documents or you can simply drag and drop
* Select 'Upload source' once you are finished
{% endhint %}

## URL

### How to add a URL source

To add a URL source, you first need to select the 'URL' option from the topic source drop down menu.

<figure><img src="../../../../.gitbook/assets/URL 1.png" alt=""><figcaption><p>Select URL from the topic source dropdown menu</p></figcaption></figure>

Once you have selected 'URL' from the topic source dropdown, the URL upload modal will appear. From here, you can add in your source. You can either add in one URL, or you also have the option to add in multiple URL's, separated by a comma list.&#x20;

<figure><img src="../../../../.gitbook/assets/URL 2.png" alt=""><figcaption><p>From the URL uploader modal you can start to add in your URL's in the 'URL Source' field</p></figcaption></figure>

You also have the option to include exclusion ID's and Classes. These optional fields allow you to select parts of your URL that you would not like to be referenced. Then when your URL source is vectorised, these ID's and Classes will not be included.

<figure><img src="../../../../.gitbook/assets/URL 3.png" alt=""><figcaption><p>Here you have the option to input any exclusion ID's and Classes for your URL source(s)</p></figcaption></figure>

Once you are happy with the files selected, you can click the 'Upload source' button to add them to your topic.

<figure><img src="../../../../.gitbook/assets/URL 4.png" alt=""><figcaption><p>Click the 'Upload source' button to add your URL's to your topic</p></figcaption></figure>

{% hint style="success" %}
* Select URL from the add source dropdown
* This will bring up the 'Upload URL's' modal
* From here, add in your URL's to the URL source field
* Add any exclusion classes or ID's that you want to&#x20;
* Select 'Upload source' once you are finished
{% endhint %}

## What is vectorisation?

In order for your Knowledge Service to determine which parts of each of the Topic Sources are the most relevant to a provided query, each Topic Source needs to be _vectorised_.

Simply put, vectorisation is the process of creating a numerical representation (known as an “embedding”) of the content of a piece of text. The way this works is: a Topic Source is split into many smaller pieces (“chunks”), and an embedding is calculated for each chunk. Each embedding gives us a representation of the content of the chunk it is referring to.

When a query is run against a Knowledge Service Topic, the text of that query is taken and vectorised to create another embedding. We can then compare this new embedding with all of the embeddings from the Topic Source chunks to determine which ones are the most similar in content.

The reason vectorisation is useful here is because it allows us to look beyond the precise words that are used in the Topic Sources, and instead use mathematical vector calculations to determine which chunks of text are the closest related in content and therefore the most likely to help answering the query.

## How to vectorise your topic sources

In order to vectorise sources, you must select which topic sources you would like to vectorise from the topic sources table. To do this, you can select the check box next to each individual source. Or, if you would like to vectorise all of your sources, you can select the checkbox in the header of the table and this will perform a 'select all' function.

<figure><img src="../../../../.gitbook/assets/Group 24 (1).png" alt=""><figcaption><p>Select the checkbox next to each individual source or select them all </p></figcaption></figure>

After you've selected the sources you've like to vectorise, an actions panel will appear above the table. From here you can hit the 'Vectorise' button and this will put the sources that you have selected through the vectorisation process.

<figure><img src="../../../../.gitbook/assets/Group 25 (1).png" alt=""><figcaption><p>Select the vectorisation button to vectorise your sources</p></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Group 26 (1).png" alt=""><figcaption><p>You will be able to confirm that you definitely want to vectorise the selected sources through a pop up modal</p></figcaption></figure>
