---
description: >-
  Use OpenDialog Attribute Management to create new attributes throughout your
  conversation, and easily access existing attributes.
---

# Attribute Management

This section outlines how to personalise your conversation through the use of existing attributes, and how to create new attributes throughout the conversation engine.&#x20;

<figure><img src="../../.gitbook/assets/Screenshot 2024-02-27 at 09.18.27.png" alt=""><figcaption><p>OpenDialog Attribute Management lets you create new attributes on a need-to-have basis throughout the conversation engine.</p></figcaption></figure>

## The basics

Attribute Management allows you to view **all** (reserved & dynamic) available attributes for your conversation in a central section on the scenario level, as well as in the message editor.

It allows you to:

* Easily select any pre-existing attribute for use from a drop-down list&#x20;
* Create a new dynamic attribute on a need-to-have basis throughout the journey&#x20;
* Set your attribute name, type, example value and description&#x20;
* View the type, example value and description for any pre-existing attribute

By integrating Attribute Management into your workflow, you can streamline the process of personalising conversations. Whether you're modifying existing attributes or introducing new ones on the fly, this feature simplifies the customisation process, enhancing the efficiency of your interactions.

## Attribute Management in action

### Create a new attribute within your scenario

With Attribute Management, you can easily create your attributes by clicking the 'Create new attribute' button. From here, you can create your new attribute by choosing its name and type. You can also add an example or description to your new attribute, to help you remember it for next time.

### View and select existing attributes

By using the drop-down section within the scenario sidebar, or by entering `{` within the message editor, you can easily navigate through a list of existing attributes and select your desired one quickly and efficiently

### Navigate attributes within the message editor

Attribute management also works within the message editor. Here you can view, select and create attributes by simply opening a new curly brace `{` . This will open up the attribute dropdown function in-line, giving you access to all the attribute management functions without having to leave the page.

## Where to find

The Attribute Management function can be found in the sidebar of the conversation designer at each component level within the conditions section, and also within the 'Advanced Intent Settings' sidebar. You can also access this functionality within the message editor.

### Intents

<figure><img src="../../.gitbook/assets/Group 2.png" alt=""><figcaption><p>The attribute input field can be accessed within the advanced intent settings section in conversation designer sidebar.</p></figcaption></figure>

To access the Attribute Management feature within the intents sidebar for a given scenario:

* Go to your workspace overview (Scenarios)
* Select the scenario you would like to update
* Select the intent you would like to add an attribute to
* Click 'Add conditions, actions and attributes' at the bottom of the sidebar
* Select 'Add new attribute'
* Start to type your chosen attribute into the 'Set attribute value' input field

### Conditions&#x20;

<figure><img src="../../.gitbook/assets/Group 1.png" alt=""><figcaption><p>The attribute management input field can be accessed under the custom conditions section of the conversation designer sidebar.</p></figcaption></figure>

To access the Attribute Management feature within the conditions sidebar for a given scenario:

* Go to your workspace overview (Scenarios)
* Select the scenario you would like to update
* Open the conversation designer for your chosen scenario
* Select 'Add new condition' from within the sidebar
* Start to type your chosen attribute into the 'If' input field

### Message editor&#x20;

<figure><img src="../../.gitbook/assets/Group 3.png" alt=""><figcaption><p>The attribute input field can be accessed within the message editor section of the conversation designer</p></figcaption></figure>

To access the Attribute Management feature within the message editor for a given scenario:

* Go to your workspace overview (Scenarios)
* Select the scenario you would like to update
* Select the message section under 'Design' in the left-hand menu
* Select the message you would like to edit
* Click within the 'Text' block for your chosen message
* Activate Attribute Management by inputting an opening curly brace `{`

## Structure

drop-downAttribute management has two main components accessible via the autocomplete drop-down menu - the selection of existing attributes and the creation of new attributes.

Both the <mark style="color:purple;">**creation of new attributes**</mark> and <mark style="color:purple;">the</mark> <mark style="color:purple;"></mark><mark style="color:purple;">**selection of existing attributes**</mark> are accessible through the custom conditions section within the conversation designer sidebar, as well as through the advanced intent settings section. This functionality can also be accessed within the message editor and within the text block. To activate you simply need to enter an opening curly brace.

## How to use

### Vocabulary

Below, we outline the vocabulary used throughout this section to describe the different types of attributes.

A <mark style="color:purple;">**reserved attribute**</mark> is an attribute that is global to the OpenDialog system. These attributes are used across all scenarios and cannot be modified or deleted. All reserved attributes can be viewed and accessed via the attribute drop-down list.

A <mark style="color:purple;">**dynamic attribute**</mark> is an attribute that is specific to your chosen scenario. These attributes are created by you through using the 'create new attribute' functionality. These attributes, once created, are then ready to view and use throughout your chosen scenario.

### Creating a new dynamic attribute

If the attribute you want to use doesn't exist within a scenario, you can add a new attribute to the list. Within the conversation designer sidebar, there are two ways to do this. The first is simply to click the 'Create new attribute' button that is located underneath the text input field. This will take you straight to the attribute creation section.

<figure><img src="../../.gitbook/assets/Group 4.png" alt=""><figcaption><p>Click the 'Create new attribute' button to create a new attribute for your scenario.</p></figcaption></figure>

The second way to create a new attribute is through the drop down itself. If you aren't sure whether the attribute you want has been created or not, you can go ahead and type it into the input field anyway. If the attribute isn't in existence, a "no results found" symbol will pop up. From here, you can click the button at the bottom of the drop-down field to bring up the create attribute section.&#x20;

<figure><img src="../../.gitbook/assets/Screenshot 2024-02-27 at 11.22.29.png" alt=""><figcaption><p>Click the button at the bottom of the drop down field to create a new attribute.</p></figcaption></figure>

This functionality is also the same within the message editor. See the image below for an example:

<figure><img src="../../.gitbook/assets/Screenshot 2024-02-27 at 11.26.11.png" alt=""><figcaption><p>Click the button at the bottom of the drop down field to create a new attribute within the message editor.</p></figcaption></figure>

Once you have selected to create a new attribute, the attribute creation modal will pop up on your screen. From here, you can input:

* Attribute name
* Attribute type
* Attribute value
* Attribute description&#x20;

Once you are happy with all of the completed fields, you can click the 'Save attribute' button at the bottom of the modal, or simply press enter. Once this is done, your attribute will be saved and added to the list of existing attributes for your scenario. This attribute can now be accessed via the drop-down list and used throughout your conversations.

<figure><img src="../../.gitbook/assets/Screenshot 2024-02-27 at 11.22.41.png" alt=""><figcaption><p>Use the 'Add new attribute' modal to create a new dynamic attribute for your scenario.</p></figcaption></figure>

### Adding an existing attribute

To add an existing attribute within the conditions panel, find the input field under 'If'. From here, start typing in the name of the attribute you wish to add. As soon as you do this, a dropdown will appear containing a list of all your pre-existing attributes. As you continue to type the name of your chosen attribute, the list will narrow down, making the attribute easier to find.&#x20;

Once you have found your chosen attribute, simply click on the item within the list.

<figure><img src="../../.gitbook/assets/Screenshot 2024-02-27 at 11.21.09.png" alt=""><figcaption><p>Start typing your chosen attribute into the text field to bring up the attribute dropdown selection.</p></figcaption></figure>

Once you have selected your attribute, you can click the information icon button on the right-hand side of the input field to find out further information about the attribute that you have chosen. For example, the attribute type, value, and description.

<figure><img src="../../.gitbook/assets/Screenshot 2024-02-27 at 12.58.47.png" alt=""><figcaption><p>Click the information icon button on the right hand side of the input field to find out further information about an attribute.</p></figcaption></figure>

An attribute can also be selected within the message editor. To do this, navigate to the message you want to edit, click within the text block, or add a new text block if there isn't already one there. To add a new attribute, open the drop-down menu by opening a curly brace `{` . From here, you can start typing an attribute name, which will bring up the list of attributes to choose from. Once you have found your chosen attribute, either click on the item within the list or press enter.&#x20;

<figure><img src="../../.gitbook/assets/Screenshot 2024-02-27 at 11.24.56.png" alt=""><figcaption><p>Open a curly brace to activate the attribute management input field within the message editor.</p></figcaption></figure>

## Frequently asked questions

#### I can't find the attribute I want in the drop-down list, what should I do?

If you can't find the attribute you are looking for, first double-check that your spelling is correct. If you have checked your spelling, and it is still not showing up in the list, that means the attribute probably doesn't exist. You can go ahead and add a new attribute by clicking "Create new attribute".

#### How do I delete or edit an attribute?

To delete or change a dynamic attribute that you've created, simply add "<mark style="color:purple;">**/admin/dynamic-attributes**</mark>" to the end of your URL whilst in your OpenDialog workspace. This will take you to your attribute management dashboard where you can customise your list of attributes.
